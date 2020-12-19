from rest_framework import serializers
from .models import Item, Order, Cart


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        exclude = ("order",)


class OrderSerializer(serializers.ModelSerializer):

    carts = CartSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        exclude = ('user',)
