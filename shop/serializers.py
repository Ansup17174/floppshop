from rest_framework import serializers
from .models import Item, Order, Cart, ItemImage
import os


class ItemSerializer(serializers.ModelSerializer):

    def get_images_urls(self, item):
        images = ItemImage.objects.filter(item=item)
        urls = [image.image.url for image in images if os.path.isfile(image.image.path)]
        return urls

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
        exclude = ("order",)


class OrderSerializer(serializers.ModelSerializer):

    carts = CartSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        exclude = ('user',)
