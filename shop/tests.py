from rest_framework.test import APITestCase
from django.shortcuts import reverse
from .models import Order, Cart, Item, ItemImage, PayUNotification
from .serializers import ItemSerializer
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
        self.cat_litterbox = Item.objects.create(
            name="Litter box",
            price=Decimal("21.99"),
            quantity=0,
            description="Litter box for cats",
            is_available=False
        )
        self.catnip = Item.objects.create(
            name="Catnip",
            price=Decimal("25.00"),
            quantity=20,
            description="Drug for cats",
            is_available=False,
            is_visible=False
        )

    def test_get_items_view(self):
        response = self.client.get(reverse("item_view"))
        self.assertEqual(response.status_code, 200)
        items_serializer = ItemSerializer(Item.objects.filter(is_available=True, is_visible=True), many=True)
        self.assertEqual(response.data, items_serializer.data)