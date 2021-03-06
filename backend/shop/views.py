from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.conf import settings
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db import transaction
from .serializers import (ItemSerializer, OrderSerializer, ShippingMethodSerializer, PayUOrderSerializer,
                          PayUNotificationSerializer, CategorySerializer, ItemImageSerializer)
from .models import Item, Order, Cart, ItemImage, ShippingMethod, PayUNotification, Category
from .exceptions import PayUException
from users.models import ShippingAddress
from users.serializers import ShippingAddressSerializer
import requests
from decimal import InvalidOperation
import json


class AdminItemViewset(ModelViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = LimitOffsetPagination

    def list(self, request, *args, **kwargs):
        if "category" in request.GET:
            items = Item.objects.filter(category__name=request.GET['category'])
        else:
            items = Item.objects.all()
        if "max_price" in request.GET:
            try:
                if float(request.GET['max_price']) > 0:
                    items = items.filter(price__lte=request.GET['max_price'])
            except (InvalidOperation, ValueError):
                pass
        if "min_price" in request.GET:
            try:
                items = items.filter(price__gte=request.GET['min_price'])
            except InvalidOperation:
                pass
        if "search" in request.GET:
            search_string = request.GET['search'].lower()
            items = items.filter(name__icontains=search_string)
        if "category" in request.GET:
            items = items.filter(category__name=request.GET['category'])
        if "order_by" in request.GET and request.GET['order_by'] in ("+", "-"):
            order_by = request.GET['order_by']
            sign = "" if order_by == "+" else "-"
            items = items.order_by(f"{sign}price")
        page = self.paginate_queryset(items)
        if page is not None:
            serializer = ItemSerializer(page, many=True, context={"request": self.request})
            return self.get_paginated_response(serializer.data)
        serializer = ItemSerializer(items, many=True, context={"request": self.request})
        return Response(serializer.data, status=200)


class AdminShippingMethodViewset(ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = ShippingMethodSerializer
    queryset = ShippingMethod.objects.all()


class ShippingMethodView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        methods = ShippingMethod.objects.filter(is_available=True)
        serializer = ShippingMethodSerializer(methods, many=True)
        return Response(serializer.data, status=200)


class AdminCategoryViewset(ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class AdminItemImageView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    queryset = ItemImage.objects.all()
    lookup_url_kwarg = "image_pk"
    serializer_class = ItemImageSerializer


class UserItemView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = LimitOffsetPagination

    def get(self, request):
        paginator = self.pagination_class()
        items = Item.objects.filter(is_visible=True)
        if "max_price" in request.GET:
            try:
                if float(request.GET['max_price']) > 0:
                    items = items.filter(price__lte=request.GET['max_price'])
            except (InvalidOperation, ValueError):
                pass
        if "min_price" in request.GET:
            try:
                items = items.filter(price__gte=request.GET['min_price'])
            except InvalidOperation:
                pass
        if "search" in request.GET:
            search_string = request.GET['search'].lower()
            items = items.filter(name__icontains=search_string)
        if "category" in request.GET:
            items = items.filter(category__name=request.GET['category'])
        if "order_by" in request.GET and request.GET['order_by'] in ("+", "-"):
            order_by = request.GET['order_by']
            sign = "" if order_by == "+" else "-"
            items = items.order_by(f"{sign}price")
        page = paginator.paginate_queryset(items, request, view=self)
        if page is not None:
            serializer = ItemSerializer(page, many=True, context={'request': self.request})
            return paginator.get_paginated_response(serializer.data)
        serializer = ItemSerializer(items, many=True, context={'request': self.request})
        return Response(serializer.data, status=200)


class UserItemDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, item_pk):
        item = get_object_or_404(Item, pk=item_pk, is_visible=True)
        serializer = ItemSerializer(item, context={'request': self.request})
        return Response(serializer.data, status=200)

    def post(self, request, item_pk):
        item = get_object_or_404(Item, pk=item_pk, is_visible=True, is_available=True)
        user = request.user
        try:
            quantity = int(request.query_params.get('quantity', " "))
        except ValueError:
            raise ValidationError({"detail": "Invalid quantity, must be a positive integer"})

        if quantity == 0:
            raise ValidationError({"detail": "Invalid quantity, must be a positive integer"})
        if quantity > item.quantity:
            raise ValidationError({"detail": f"Invalid quantity ({item.quantity} available)"})
        with transaction.atomic():
            order, order_is_created = Order.objects.get_or_create(user=user, is_finished=False)
            if not order_is_created:
                cart, cart_is_created = Cart.objects.get_or_create(order=order, item=item)
                if cart.quantity + quantity > item.quantity or cart.quantity + quantity < 0:
                    raise ValidationError(
                        {
                            "detail": f"Invalid quantity, {item.quantity - cart.quantity} left available (In cart: {cart.quantity}, in-stock: {item.quantity})"}
                    )
                if cart.quantity + quantity == 0:  # removing item from cart
                    order.quantity -= 1
                    cart.delete()
                    if order.quantity >= 1:
                        order.save()
                    else:
                        order.delete()
                        return Response(status=204)
                    return Response({"detail": f"Removed {item.name} from cart"})
                cart.quantity += quantity
                if cart_is_created:
                    order.quantity += 1
            else:
                if quantity < 0:
                    raise ValidationError({"detail": "Invalid quantity, must be a positive integer"})
                cart = Cart.objects.create(order=order, item=item)
                cart.quantity += quantity
                order.quantity += 1
            cart.save()
            order.save()
            item_price = quantity * item.price
            if quantity < 0:
                message = f"{-quantity} items were removed from cart for total price of {-item_price}zł"
            else:
                message = f"{quantity} items were added to cart for total price of {item_price}zł"
            return Response({"detail": message}, status=200)


class UserOrderView(APIView):
    pagination_class = LimitOffsetPagination

    def get(self, request):
        if 'history' in request.query_params:
            orders = Order.objects.filter(user=request.user, is_finished=True).order_by("-date_finished")
            paginator = LimitOffsetPagination()
            page = paginator.paginate_queryset(orders, request, view=self)
            if page:
                serializer = OrderSerializer(page, many=True, context={"request": self.request})
                return paginator.get_paginated_response(serializer.data)
            serializer = OrderSerializer(orders, many=True, context={"request": self.request})
            return Response(serializer.data, status=200)
        else:
            order = get_object_or_404(Order, user=request.user, is_finished=False, is_paid=False)
            serializer = OrderSerializer(order, context={"request": self.request})
            return Response(serializer.data, status=200)

    def post(self, request):
        order = get_object_or_404(Order, user=request.user, is_finished=False)
        request_data = request.data
        if "method" not in request_data:
            raise ValidationError({"detail": "Invalid shipping method"})
        shipping_method_name = request_data.pop('method')
        shipping_method = get_object_or_404(ShippingMethod, name=shipping_method_name, is_available=True)
        shipping_address_serializer = ShippingAddressSerializer(data=request_data)
        if shipping_address_serializer.is_valid(raise_exception=True):
            shipping_address = ShippingAddress.objects.create(**shipping_address_serializer.validated_data)
        order.address = shipping_address
        order.method = shipping_method
        order.is_finished = True
        order.date_finished = timezone.now()
        for cart in order.carts.all():
            if cart.item.quantity < cart.quantity:
                if not cart.item.quantity:
                    cart.delete()
                    raise ValidationError({
                        "detail": f"{cart.item.name} quantity is invalid, item not available"
                    })
                else:
                    cart.quantity = cart.item.quantity
                    cart.save()
                    raise ValidationError({
                        "detail": f"{cart.item.name} quantity is invalid, changed to {cart.item.quantity} (max)"
                    })
        with transaction.atomic():
            for cart in order.carts.all():
                cart.item.quantity -= cart.quantity
                cart.item.save()
            order.total_price = OrderSerializer().get_order_total_price(order)
            order.save()
        order_serializer = OrderSerializer(order, context={"request": self.request})
        return Response(order_serializer.data, status=200)


class UserOrderPaymentView(APIView):

    def get(self, request, order_pk):
        order = get_object_or_404(Order, pk=order_pk, user=request.user, is_finished=True, is_paid=False)
        return Response({"detail": f"Total price to pay: {order.total_price + order.method.price}"}, status=200)

    def prepare_request(self, order):
        products = []
        for cart in order.carts.all():
            products.append({
                "name": cart.item.name,
                "unitPrice": str(int(cart.item.price * 100)),
                "quantity": str(cart.quantity)
            })
        buyer = {
            "email": order.user.email,
            "phone": str(order.user.phone),
            "firstName": order.user.first_name,
            "lastName": order.user.last_name,
            "language": "pl"
        }
        payu_order = {
            "customerIp": "127.0.0.1",
            "notifyUrl": "http://floppshopbackend.herokuapp.com/shop/notify/",
            "extOrderId": order.pk,
            "merchantPosId": settings.MERCHANT_POS_ID,
            "description": "Floppshop order",
            "currencyCode": "PLN",
            "totalAmount": str(int(order.total_price * 100)),
            "buyer": buyer,
            "products": products
        }
        payu_order_serializer = PayUOrderSerializer(data=payu_order)
        payu_order_serializer.is_valid(raise_exception=True)
        return payu_order_serializer

    def post(self, request, order_pk):
        order = get_object_or_404(Order, pk=order_pk, user=request.user, is_finished=True, is_paid=False)
        request_data = self.prepare_request(order).data
        payu_login_response = requests.post(
            "https://secure.snd.payu.com/pl/standard/user/oauth/authorize?"
            + "grant_type=client_credentials"
            + f"&client_id={settings.MERCHANT_POS_ID}"
            + f"&client_secret={settings.CLIENT_SECRET}"
        )
        if payu_login_response.status_code != 200:
            raise PayUException()
        payu_response = requests.post(
            "https://secure.snd.payu.com/api/v2_1/orders",
            json=request_data,
            headers={
                "content-type": "application/json",
                "Authorization": f"Bearer {payu_login_response.json().get('access_token')}"
            },
            allow_redirects=False
        )
        if payu_response.status_code != 302:
            raise PayUException()
        payment_url = payu_response.json()['redirectUri']
        order.payment_url = payment_url
        order.save()
        response = {"redirectUri": payment_url}
        return Response(response, status=200)


class PayUNotifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        notification_serializer = PayUNotificationSerializer(data=request.data)
        notification_serializer.is_valid(raise_exception=True)
        PayUNotification.objects.create(content=json.dumps(request.data))
        if notification_serializer.validated_data['order']['status'] == "COMPLETED":
            order = get_object_or_404(
                Order,
                pk=notification_serializer.validated_data['order']['extOrderId'],
                is_paid=False,
                is_finished=True
            )
            order.is_paid = True
            order.date_paid = notification_serializer.validated_data['localReceiptDateTime']
            order.save()
        return Response(status=200)


class AdminNotificationView(APIView):
    permission_classes = [IsAdminUser]
    pagination_class = LimitOffsetPagination

    def get(self, request):
        paginator = self.pagination_class()
        notifications = [json.loads(notification.content) for notification in PayUNotification.objects.all()]
        page = paginator.paginate_queryset(notifications, request, view=self)
        if page is not None:
            return paginator.get_paginated_response(page)
        return Response(notifications, status=200)
