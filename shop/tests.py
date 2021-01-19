from rest_framework.test import APITestCase
from django.shortcuts import reverse
from .models import Order, Cart, Item, ItemImage, PayUNotification
from decimal import Decimal


class ShopTestCase(APITestCase):

    def setUp(self):
        self.cat_food = Item.objects.create(
            name="Cat food(chicken) - 1kg",
            price=Decimal("10.99"),
            quantity=100,
            description="Cat food for cats",
        )
        self.cat_toy = Item.objects.create(
            name="Cat plush toy",
            price=Decimal("2.40"),
            quantity=100,
            description="Cat plush toy made for cats",
            discount_price=Decimal("2.19"),
            is_discount=True
        )