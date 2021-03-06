from django.db import models, IntegrityError
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver
from users.models import ShippingAddress
from decimal import Decimal
import uuid
import string
from random import choice


class ShippingMethod(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    name = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name

def generate_order_pk():
    signs = string.ascii_letters + string.digits
    pk = ""
    for i in range(20):
        pk += choice(signs)
    return pk

class Order(models.Model):
    id = models.CharField(max_length=20, primary_key=True, editable=False, default=generate_order_pk)
    user = models.ForeignKey(get_user_model(), on_delete=models.DO_NOTHING, related_name="orders")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], default=Decimal("0.00"))
    is_finished = models.BooleanField(default=False)
    is_paid = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    date_finished = models.DateTimeField(null=True, blank=True)
    date_paid = models.DateTimeField(null=True, blank=True)
    quantity = models.PositiveIntegerField(default=0)
    payment_url = models.CharField(max_length=700, null=True, blank=True)
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


@receiver(pre_save, sender=Order)
def pre_order_save(sender, instance, *args, **kwargs):
    if not instance.is_finished:
        if Order.objects.exclude(pk=instance.pk).filter(user=instance.user, is_finished=False).count():
            raise IntegrityError("Only one active order may exist")
    if instance.is_paid and not instance.is_finished:
        raise IntegrityError("Order cannot be paid and not finished")


class Category(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    name = models.CharField(max_length=70, unique=True)


class Item(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    name = models.CharField(max_length=200)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        default=Decimal("0.00")
        )
    category = models.ForeignKey(Category, on_delete=models.DO_NOTHING, null=True, blank=True)
    old_price = models.DecimalField(
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
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    item = models.ForeignKey(Item, on_delete=models.DO_NOTHING, related_name="images")
    image = models.FileField(blank=True, null=True, upload_to=get_upload_path)
    is_main = models.BooleanField(default=False)

    class Meta:
        ordering = ['-is_main']


@receiver(pre_save, sender=ItemImage)
def pre_save_image(sender, instance, *args, **kwargs):
    if not ItemImage.objects.filter(item=instance.item).count():
        instance.is_main = True


@receiver(pre_delete, sender=ItemImage)
def pre_delete_image(sender, instance, *args, **kwargs):
    if instance.is_main and ItemImage.objects.filter(item=instance.item).count() - 1:
        first = ItemImage.objects.filter(item=instance.item).exclude(pk=instance.pk).first()
        first.is_main = True
        first.save()
    instance.image.delete()


class Cart(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    item = models.ForeignKey(
        Item,
        on_delete=models.DO_NOTHING,
    )
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="carts")
    quantity = models.PositiveIntegerField(default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], default=Decimal("0.00"))


class PayUNotification(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    content = models.CharField(max_length=5000)
