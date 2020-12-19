from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.exceptions import NotAcceptable
from rest_framework.permissions import IsAdminUser
from django.db import transaction, IntegrityError
from .serializers import ItemSerializer, OrderSerializer
from .models import Item, Order, Cart


class AdminItemViewset(ModelViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    permission_classes = [IsAdminUser]


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

    #add to cart
    def post(self, request, pk):
        item = get_object_or_404(Item, pk=pk, is_visible=True, is_available=True)
        user = request.user
        quantity = int(request.query_params.get('quantity', 0))
        if quantity > item.quantity:
            raise NotAcceptable("Quantity is higher than in the stock")
        order, is_created = Order.objects.get_or_create(user=user, is_finished=False)
        if is_created:
            cart = order.carts.get(item=item)
            cart.quantity += quantity
            cart.total_price += item.price * quantity
            order.total_price += item.price * quantity
        else:
            cart = Cart.objects.create(order=order, item=item)
            cart.quantity += quantity
            cart.total_price += quantity * item.price
            order.quantity += 1
            order.total_price += quantity * item.price
        try:
            with transaction.atomic():
                cart.save()
                order.save()
            return Response(
                {
                    "message": f"{quantity} items were added to cart for total price of {quantity*item.price}"
                },
                status=200
            )
        except IntegrityError:
            return Response({"message": "Something went wrong when adding item to cart!"}, status=400)


class UserOrderView(APIView):

    def get(self, request):
        order = get_object_or_404(Order, user=request.user, is_finished=False)
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=200)
