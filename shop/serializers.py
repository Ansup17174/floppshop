from rest_framework import serializers
from .models import Item, Order, Cart, ItemImage, ShippingMethod
from users.serializers import ShippingAddressSerializer
from decimal import Decimal
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

    def get_cart_total_price(self, cart):
        return cart.quantity * (cart.item.discount_price if cart.item.is_discount else cart.item.price)

    item_name = serializers.SerializerMethodField("get_item_name")
    total_price = serializers.SerializerMethodField("get_cart_total_price", read_only=True)

    class Meta:
        model = Cart
        exclude = ("order", 'id')


class ShippingMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingMethod
        exclude = ('id',)


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
    extOrderId = serializers.CharField(max_length=30)
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
