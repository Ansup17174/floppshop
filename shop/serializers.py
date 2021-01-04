from rest_framework import serializers
from .models import Item, Order, Cart, ItemImage, ShippingMethod
from users.serializers import ShippingAddressSerializer
import os


class ItemSerializer(serializers.ModelSerializer):

    def get_images_urls(self, item):
        images = ItemImage.objects.filter(item=item)
        image_list = [{"url": image.image.url, "id": image.pk} for image in images if os.path.isfile(image.image.path)]
        return image_list

    images = serializers.SerializerMethodField("get_images_urls", read_only=True)

    class Meta:
        model = Item
        fields = "__all__"

    def create(self, validated_data):
        images_data = self.context.get("view").request.FILES.getlist("images")
        item = Item.objects.create(**validated_data)
        for image_data in images_data:
            ItemImage.objects.create(item=item, image=image_data)
        return item

    def update(self, item, validated_data):
        images_data = self.context.get("view").request.FILES.getlist("images")
        for image_data in images_data:
            ItemImage.objects.create(item=item, image=image_data)
        return item


class CartSerializer(serializers.ModelSerializer):

    def get_item_name(self, cart):
        return cart.item.name

    item_name = serializers.SerializerMethodField("get_item_name")

    class Meta:
        model = Cart
        exclude = ("order", 'id')


class ShippingMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingMethod
        exclude = ('id',)


class OrderSerializer(serializers.ModelSerializer):

    def get_total_price(self, order):
        if order.method is not None:
            return str(order.total_price + order.method.price)
        return str(order.total_price)

    carts = CartSerializer(many=True, read_only=True)
    address = ShippingAddressSerializer(read_only=True)
    method = ShippingMethodSerializer(read_only=True)
    total_price = serializers.SerializerMethodField("get_total_price")

    class Meta:
        model = Order
        exclude = ('user', 'id')
