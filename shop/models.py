from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from users.models import ShippingAddress
from decimal import Decimal


class ShippingMethod(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.DO_NOTHING, related_name="orders")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], default=Decimal("0.00"))
    is_finished = models.BooleanField(default=False)
    is_paid = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    date_finished = models.DateTimeField(null=True, blank=True)
    date_paid = models.DateTimeField(null=True, blank=True)
    quantity = models.PositiveIntegerField(default=0)
    address = models.OneToOneField(
        ShippingAddress,
        on_delete=models.DO_NOTHING,
        related_name="order",
        blank=True,
        null=True
    )
    method = models.ForeignKey(
        ShippingMethod,
        on_delete=models.DO_NOTHING,
        blank=True,
        null=True,
        related_name="orders"
    )


class Item(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        default=Decimal("0.00")
    )
    quantity = models.PositiveIntegerField(default=0)
    description = models.CharField(max_length=500)
    is_available = models.BooleanField(default=True)
    is_discount = models.BooleanField(default=False)
    is_visible = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if self.quantity <= 0:
            self.quantity = 0
            self.is_available = False
        super().save(*args, **kwargs)


def get_upload_path(instance, filename):
    return f"{instance.item.id}/{filename}"


class ItemImage(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="images")
    image = models.FileField(blank=True, null=True, upload_to=get_upload_path)


@receiver(pre_delete, sender=ItemImage)
def pre_delete_image(sender, instance, *args, **kwargs):
    instance.image.delete()


class Cart(models.Model):
    item = models.ForeignKey(
        Item,
        on_delete=models.DO_NOTHING,
    )
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="carts")
    quantity = models.PositiveIntegerField(default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], default=Decimal("0.00"))


class PayUNotification(models.Model):
    content = models.CharField(max_length=1000)


# TODO switch from 1,2,3 id to uuid
