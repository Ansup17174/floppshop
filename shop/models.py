from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from users.models import ShippingAddress


class Order(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.DO_NOTHING, related_name="orders")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    is_finished = models.BooleanField(default=False)
    is_paid = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    date_finished = models.DateTimeField(null=True, blank=True)
    date_paid = models.DateTimeField(null=True, blank=True)
    quantity = models.PositiveIntegerField(default=0)
    shipping_address = models.OneToOneField(
        ShippingAddress,
        on_delete=models.DO_NOTHING,
        related_name="order",
        blank=True,
        null=True
    )


class Item(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    quantity = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)


class Cart(models.Model):
    item = models.OneToOneField(
        Item,
        on_delete=models.DO_NOTHING,
        null=True,
        related_name="cart"
    )
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="carts")
    quantity = models.PositiveIntegerField(default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
