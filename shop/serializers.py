from rest_framework import serializers
from .models import Item, Order, Cart


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"


class CartSerializer(serializers.ModelSerializer):

    def get_item_name(self, cart):
        return cart.item.name

    item_name = serializers.SerializerMethodField("get_item_name")

    class Meta:
        model = Cart
        exclude = ("order",)


class OrderSerializer(serializers.ModelSerializer):

    carts = CartSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        exclude = ('user',)
