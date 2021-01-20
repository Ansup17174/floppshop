from rest_framework.test import APITestCase
from django.shortcuts import reverse
from django.core import mail
from django.db import IntegrityError
from django.test import tag
from .models import ShippingMethod
from .models import Order, Cart, Item
from .serializers import ItemSerializer
from decimal import Decimal
import re


@tag("shop")
class ShopOrderExistsTestCase(APITestCase):

    def add_item_to_order(self, item, quantity):
        response = self.client.post(
            reverse("item_details_view", args=(item.pk,))
            + f"?quantity={quantity}"
        )
        return response

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
        self.email = "janusz@op.pl"
        self.password = "krowa123"
        self.first_name = "Januszaaa"
        self.last_name = "Tracz"
        self.phone = "666691337"
        self.date_of_birth = "2000-01-04"
        request_body = {
            "email": self.email,
            "password1": self.password,
            "password2": self.password,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone": self.phone,
            "date_of_birth": self.date_of_birth
        }
        self.client.post(reverse("rest_register"), request_body, format="json")
        key = re.search(r"\w\w:[a-zA-Z0-9-_:]+", mail.outbox[0].body)
        if not key:
            raise AssertionError
        email_confirmation_request = {"key": key.group(0)}
        self.client.post(
            reverse("rest_verify_email"),
            email_confirmation_request,
            format="json"
        )
        login_request = {
            "email": self.email,
            "password": self.password
        }
        self.client.post(reverse("rest_login"), login_request, format="json")
        self.add_item_to_order(self.cat_food, 30)
        self.shipping_method = ShippingMethod.objects.create(name="InPost", price=Decimal("9.99"))
        self.shipping_address = {
            "street": "Szkolna",
            "state": "Podlaskie",
            "number": "17",
            "post_code": "23-400",
            "city": "Białystok",
            "method": self.shipping_method.name
        }

    def test_order_disappears_when_empty(self):
        response = self.add_item_to_order(self.cat_food, -30)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"detail": f"Removed {self.cat_food.name} from cart"})
        self.assertQuerysetEqual(Cart.objects.all(), Cart.objects.none())
        self.assertQuerysetEqual(Order.objects.all(), Order.objects.none())

    def test_submit_order(self):
        order = Order.objects.all().first()
        response = self.client.post(reverse("order_view"), self.shipping_address, format="json")
        self.assertEqual(response.status_code, 200)
        self.cat_food.refresh_from_db()
        self.assertEqual(self.cat_food.quantity, 70)
        order.refresh_from_db()
        self.assertTrue(order.is_finished)
        self.assertFalse(order.is_paid)

    def test_submit_order_when_item_quantity_changed(self):
        self.cat_food.quantity = 1
        self.cat_food.save()
        response = self.client.post(reverse("order_view"), self.shipping_address, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {
            "detail": f"{self.cat_food.name} quantity is invalid, changed to {self.cat_food.quantity} (max)"
        })

    def test_user_can_have_only_one_order_active(self):
        order = Order.objects.all().first()
        Order.objects.create(user=order.user, is_finished=True)
        with self.assertRaises(IntegrityError):
            Order.objects.create(user=order.user)
        with self.assertRaises(IntegrityError):
            Order.objects.create(user=order.user, is_paid=True)

    def test_starting_payment(self):
        self.client.post(reverse("order_view"), self.shipping_address, format="json")
