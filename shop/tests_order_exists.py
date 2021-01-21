from rest_framework.test import APITestCase
from django.shortcuts import reverse
from django.core import mail
from django.db import IntegrityError
from django.test import tag
from .models import ShippingMethod
from .models import Order, Cart, Item
from datetime import datetime
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

    # def test_starting_payment(self):
    #     self.client.post(reverse("order_view"), self.shipping_address, format="json")
    #     order = Order.objects.all().first()
    #     ext_order_id = str(order.pk)
    #     payment_response = self.client.post(reverse("payment_view", args=(order.pk,)))
    #     print(payment_response)
    #     self.assertEqual(payment_response.status_code, 200)
    #     self.assertEqual(payment_response.data.get('status').get('statusCode'), "SUCCESS")
    #     self.assertEqual(payment_response.data.get("extOrderId"), ext_order_id)

    def test_receiving_payu_notification(self):
        order = Order.objects.all().first()
        order.is_finished = True
        order.save()
        payu_notification = {
            "order": {
                "orderId": "LDLW5N7MF4140324GUEST000P01",
                "extOrderId": str(order.pk),
                "orderCreateDate": "2012-12-31T12:00:00",
                "notifyUrl": "abc",
                "customerIp": "127.0.0.1",
                "merchantPosId": "123456",
                "description": "Twój opis zamówienia",
                "currencyCode": "PLN",
                "totalAmount": "200",
                "buyer": {
                    "email": "john.doe@example.org",
                    "phone": "111111111",
                    "firstName": "John",
                    "lastName": "Doe",
                    "language": "pl"
                },
                "payMethod": {
                    "type": "CARD_TOKEN"
            },
            "products": [
                {
                    "name": "Product 1",
                    "unitPrice": "200",
                    "quantity": "1"
                }
            ],
            "status": "COMPLETED"
        },
        "localReceiptDateTime": "2016-03-02T12:58:14.828+01:00",
        "properties": [
            {
                "name": "PAYMENT_ID",
                "value": "151471228"
            }
            ]
        }

        notification_response = self.client.post(reverse("notify_view"), payu_notification, format="json")
        self.assertEqual(notification_response.status_code, 200)
        order.refresh_from_db()
        self.assertTrue(order.is_paid)
        self.assertEqual(
            order.date_paid,
            datetime.strptime(payu_notification.get("localReceiptDateTime"), "%Y-%m-%dT%H:%M:%S.%f%z")
        )
# TODO test images
