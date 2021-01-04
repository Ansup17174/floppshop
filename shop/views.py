from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.generics import DestroyAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db import transaction, IntegrityError
from .serializers import ItemSerializer, OrderSerializer, ShippingMethodSerializer
from .models import Item, Order, Cart, ItemImage, ShippingMethod
from users.models import ShippingAddress
from users.serializers import ShippingAddressSerializer


class AdminItemViewset(ModelViewSet):

    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class AdminShippingMethodViewset(ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = ShippingMethodSerializer
    queryset = ShippingMethod.objects.all()


class AdminDeleteItemImageView(DestroyAPIView):

    permission_classes = [IsAdminUser]
    queryset = ItemImage.objects.all()
    lookup_url_kwarg = "image_pk"


class UserItemView(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        items = Item.objects.filter(is_visible=True)
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data, status=200)


class UserItemDetailView(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        item = get_object_or_404(Item, pk=pk, is_visible=True)
        serializer = ItemSerializer(item)
        return Response(serializer.data, status=200)

    def post(self, request, item_pk):
        item = get_object_or_404(Item, pk=item_pk, is_visible=True, is_available=True)
        user = request.user
        try:
            quantity = int(request.query_params.get('quantity', " "))
        except ValueError:
            raise ValidationError({"detail": "Invalid quantity"})
        if quantity == 0:
            raise ValidationError({"detail": "Invalid quantity"})
        if quantity > item.quantity:
            raise ValidationError({"detail": "Invalid quantity"})
        order, is_created = Order.objects.get_or_create(user=user, is_finished=False)
        if not is_created:
            cart = order.carts.get(item=item)
            if cart.quantity + quantity > item.quantity or cart.quantity + quantity < 0:
                raise ValidationError({"detail": "Invalid quantity"})
            if cart.quantity + quantity == 0:
                order.quantity -= 1
                order.total_price -= cart.total_price
                try:
                    with transaction.atomic():
                        cart.delete()
                        if order.quantity:
                            order.save()
                        else:
                            order.delete()
                    return Response({"detail": f"Removed {item.name} from cart"})
                except IntegrityError:
                    return Response({"detail": "Something went wrong when removing items from cart!"}, status=400)
            cart.quantity += quantity
            cart.total_price += item.price * quantity
            order.total_price += item.price * quantity
        else:
            if quantity < 0:
                raise ValidationError({"detail": "Invalid quantity"})
            cart = Cart.objects.create(order=order, item=item)
            cart.quantity += quantity
            cart.total_price += quantity * item.price
            order.quantity += 1
            order.total_price += quantity * item.price
        try:
            with transaction.atomic():
                cart.save()
                order.save()
                if quantity < 0:
                    message = f"{-quantity} items were removed from cart for total price of {-quantity*item.price}"
                else:
                    message = f"{quantity} items were added to cart for total price of {quantity*item.price}"
            return Response({"detail": message}, status=200)
        except IntegrityError:
            return Response({"detail": "Something went wrong when adding item to cart!"}, status=400)


class UserOrderView(APIView):

    def get(self, request):
        order = get_object_or_404(Order, user=request.user, is_paid=False)
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=200)

    def post(self, request):
        order = get_object_or_404(Order, user=request.user, is_finished=False)
        request_data = request.data
        if "shipping_method" not in request_data:
            raise ValidationError({"detail": "Invalid shipping method"})
        shipping_method_name = request_data.pop('shipping_method')
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
                raise ValidationError({"detail": f"{cart.item.name} quantity is invalid"})
        with transaction.atomic():
            for cart in order.carts.all():
                cart.item.quantity -= cart.quantity
                cart.item.save()
            order.save()
        order_serializer = OrderSerializer(order)
        return Response(order_serializer.data, status=200)


# TODO sprawdzic robienie kilku orderow na raz, potem chyba platnsoci
