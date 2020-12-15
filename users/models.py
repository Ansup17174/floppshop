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
        primary_key=True
    )
    street = models.CharField(max_length=200)
    state = models.CharField(max_length=50)
    number = models.PositiveIntegerField()
    post_code = models.CharField(max_length=6)
    city = models.CharField(max_length=100)


