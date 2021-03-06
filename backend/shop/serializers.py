from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from .models import Item, Order, Cart, ItemImage, ShippingMethod, Category
from users.serializers import ShippingAddressSerializer
from decimal import Decimal
import os
import filetype


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ItemImageSerializer(serializers.ModelSerializer):

    def get_image_url(self, image):
        request = self.context.get('request')
        return request.build_absolute_uri(image.image.url) if os.path.isfile(image.image.path) else None

    url = serializers.SerializerMethodField('get_image_url', read_only=True)

    class Meta:
        model = ItemImage
        fields = ('id', 'url', 'is_main')

    def update(self, instance, validated_data):
        ItemImage.objects.filter(item=instance.item).update(is_main=False)
        instance.is_main = True
        instance.save()
        return instance


class ItemSerializer(serializers.ModelSerializer):

    def get_images(self, item):
        request = self.context.get('request')
        images = ItemImage.objects.filter(item=item)
        image_list = [{
            "id": image.pk,
            "url": request.build_absolute_uri(image.image.url),
            "is_main": image.is_main
        } for image in images if os.path.isfile(image.image.path)]
        return image_list

    def get_category_name(self, item):
        return None if item.category is None else item.category.name

    def upload_images(self, images_data, item):
        if images_data:
            for image_data in images_data:
                if not filetype.is_image(image_data):
                    raise ValidationError({"detail": "All files have to be valid images"})
            for image_data in images_data:
                ItemImage.objects.create(item=item, image=image_data)

    images = serializers.SerializerMethodField("get_images", read_only=True)
    category_name = serializers.CharField(max_length=70, required=False, write_only=True)
    category = serializers.SerializerMethodField("get_category_name", read_only=True)

    class Meta:
        model = Item
        fields = "__all__"

    def create(self, validated_data):
        images_data = self.context.get("view").request.FILES.getlist("images")
        category_name = validated_data.pop("category_name", None)
        item = Item.objects.create(**validated_data)
        if category_name is not None:
            category = get_object_or_404(Category, name=category_name)
            item.category = category
            item.save()
        self.upload_images(images_data, item)
        return item

    def update(self, item, validated_data):
        images_data = self.context.get("view").request.FILES.getlist("images")
        category_name = validated_data.pop("category_name", None)
        if category_name is not None:
            category = get_object_or_404(Category, name=category_name)
            item.category = category
            item.save()
        self.upload_images(images_data, item)
        item = super().update(item, validated_data)
        return item


class CartSerializer(serializers.ModelSerializer):

    # def get_item_name(self, cart):
    #     return cart.item.name

    def get_cart_total_price(self, cart):
        return cart.quantity * cart.item.price

    # item_name = serializers.SerializerMethodField("get_item_name")
    total_price = serializers.SerializerMethodField("get_cart_total_price", read_only=True)
    item = ItemSerializer(read_only=True)

    class Meta:
        model = Cart
        exclude = ("order", 'id')


class ShippingMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingMethod
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):

    def get_order_total_price(self, order):
        total_price = Decimal("0.00")
        for cart in order.carts.all():
            total_price += CartSerializer().get_cart_total_price(cart)
        if order.method is not None:
            total_price += order.method.price
        return total_price

    carts = CartSerializer(many=True, read_only=True)
    address = ShippingAddressSerializer(read_only=True)
    method = ShippingMethodSerializer(read_only=True)
    total_price = serializers.SerializerMethodField("get_order_total_price", read_only=True)

    class Meta:
        model = Order
        exclude = ('user',)
        read_only_fields = ('payment_url',)


class PayUBuyerSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=50)
    phone = serializers.CharField(max_length=12)
    firstName = serializers.CharField(max_length=200)
    lastName = serializers.CharField(max_length=200)
    language = serializers.CharField(max_length=10)


class PayUProductSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    unitPrice = serializers.CharField(max_length=100)
    quantity = serializers.CharField(max_length=30)


class PayUMethodSerializer(serializers.Serializer):
    type = serializers.CharField(max_length=20)


class PayUOrderSerializer(serializers.Serializer):
    notifyUrl = serializers.CharField(max_length=100, required=False)
    extOrderId = serializers.CharField(max_length=30, required=False)
    customerIp = serializers.CharField(max_length=20)
    merchantPosId = serializers.CharField(max_length=6)
    description = serializers.CharField(max_length=200)
    currencyCode = serializers.CharField(max_length=5)
    totalAmount = serializers.CharField(max_length=100)

    buyer = PayUBuyerSerializer(required=False)
    products = PayUProductSerializer(many=True)

    payMethod = PayUMethodSerializer(required=False)
    status = serializers.CharField(max_length=30, required=False)


class PayUPropertySerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    value = serializers.CharField(max_length=100)


class PayUNotificationSerializer(serializers.Serializer):
    order = PayUOrderSerializer()
    localReceiptDateTime = serializers.DateTimeField(required=False)
    properties = PayUPropertySerializer(many=True, required=False)
