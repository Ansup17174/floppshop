from django.test import TestCase
from decimal import Decimal


class PriceTestCase(TestCase):
    def setUp(self):
        self.items = [
            {
                "price": Decimal("10.99"),
                "is_discount": False
            },
            {
                "is_discount": True,
                "discount_price": Decimal("5.99")
            }
        ]
        self.cart1 = {"item": self.items[0], "quantity": 5}
        self.cart2 = {"item": self.items[1], "quantity": 10}
        self.order1 = {
            "carts": [self.cart1, self.cart2],
            "method": {
                "price": Decimal("12.99")
            }
        }
        self.order2 = {
            "carts": [self.cart1],
            "method": None
        }

    # modified to use ['property'] instead of .property
    def get_cart_total_price(self, cart):
        return cart['quantity']\
               * (cart['item']['discount_price'] if cart['item']['is_discount'] else cart['item']['price'])

    def get_order_total_price(self, order):
        total_price = Decimal("0.00")
        for cart in order['carts']:
            total_price += self.get_cart_total_price(cart)
        if order["method"] is not None:
            total_price += order["method"]["price"]
        return total_price

    def test_cart_get_price(self):
        expected_price1 = Decimal("54.95")
        expected_price2 = Decimal("59.9")
        self.assertEqual(self.get_cart_total_price(self.cart1), expected_price1)
        self.assertEqual(self.get_cart_total_price(self.cart2), expected_price2)

    def test_order_get_price(self):
        expected_price1 = Decimal("127.84")
        expected_price2 = Decimal("54.95")
        self.assertEqual(self.get_order_total_price(self.order1), expected_price1)
        self.assertEqual(self.get_order_total_price(self.order2), expected_price2)
