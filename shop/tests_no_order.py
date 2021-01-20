from rest_framework.test import APITestCase
from django.shortcuts import reverse
from django.test import tag
from django.core import mail
from .models import Order, Cart, Item
from .serializers import ItemSerializer
from decimal import Decimal
import re


@tag("shop")
class ShopNoOrderTestCase(APITestCase):

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
        key = re.search(r"\w\w:[a-zA-Z0-9-_:]+", mail.outbox[-1].body)
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

    def test_get_items_view(self):
        response = self.client.get(reverse("item_view"))
        self.assertEqual(response.status_code, 200)
        items_serializer = ItemSerializer(Item.objects.filter(is_visible=True), many=True)
        self.assertEqual(response.data, items_serializer.data)

    def test_get_item_by_pk(self):
        cat_food_pk = self.cat_food.pk
        catnip_pk = self.catnip.pk
        cat_food_response = self.client.get(reverse("item_details_view", kwargs={"item_pk": cat_food_pk}))
        catnip_response = self.client.get(reverse("item_details_view", kwargs={"item_pk": catnip_pk}))
        cat_food_serializer = ItemSerializer(self.cat_food)
        self.assertEqual(cat_food_response.status_code, 200)
        self.assertEqual(catnip_response.status_code, 404)
        self.assertEqual(cat_food_response.data, cat_food_serializer.data)

    def add_item_to_order(self, item, quantity):
        response = self.client.post(
            reverse("item_details_view", args=(item.pk,))
            + f"?quantity={quantity}"
        )
        return response

    def test_add_item_to_order(self):
        quantity = 15
        add_item_response = self.add_item_to_order(self.cat_food, quantity)
        self.assertEqual(add_item_response.status_code, 200)
        expected_response = {
            "detail": f"{quantity} items were added to cart for total price of {quantity * self.cat_food.price}"
        }
        self.assertEqual(add_item_response.data, expected_response)
        get_order_response = self.client.get(reverse("order_view"))
        self.assertEqual(get_order_response.status_code, 200)
        order = Order.objects.all().first()
        cart = Cart.objects.all().first()
        self.assertTrue(cart in order.carts.all())

    def test_add_item_with_discount_price(self):
        quantity = 10
        add_item_response = self.add_item_to_order(self.cat_toy, quantity)
        self.assertEqual(add_item_response.status_code, 200)
        expected_response = {
            "detail": f"{quantity} items were added to cart for total price of"
                      f" {quantity * self.cat_toy.discount_price}"
        }
        self.assertEqual(add_item_response.data, expected_response)

    def test_add_invisible_or_unavailable(self):
        quantity = 15
        litterbox_response = self.add_item_to_order(self.cat_litterbox, quantity)
        self.assertEqual(litterbox_response.status_code, 404)
        catnip_response = self.add_item_to_order(self.catnip, quantity)
        self.assertEqual(catnip_response.status_code, 404)

    def test_add_item_with_improper_quantity(self):
        cat_food_response = self.add_item_to_order(self.cat_food, 111)
        self.assertEqual(cat_food_response.status_code, 400)
        self.assertEqual(cat_food_response.data, {"detail": "Invalid quantity"})
        cat_toy_response = self.add_item_to_order(self.cat_toy, -1111)
        self.assertEqual(cat_toy_response.status_code, 400)
        self.assertEqual(cat_toy_response.data, {"detail": "Invalid quantity"})

    def test_add_item_to_order_without_authentication(self):
        logout_response = self.client.post(reverse("rest_logout"))
        self.assertEqual(logout_response.status_code, 200)
        add_item_response = self.add_item_to_order(self.cat_food, 5)
        self.assertEqual(add_item_response.status_code, 401)
