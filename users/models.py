from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    date_of_birth = models.DateField()
    phone = models.IntegerField()


class ShippingAddress(models.Model):
    user = models.OneToOneField(
        get_user_model(),
        on_delete=models.DO_NOTHING,
        related_name="shipping_address",
        null=True
    )
    street = models.CharField(max_length=200, blank=False, null=False)
    state = models.CharField(max_length=50, blank=False, null=False)
    number = models.PositiveIntegerField(blank=False, null=False)
    post_code = models.CharField(max_length=6, blank=False, null=False)
    city = models.CharField(max_length=100, blank=False, null=False)


