from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model


class CustomUser(AbstractUser):
    date_of_birth = models.DateField()
    phone = models.IntegerField()


class ShippingAddress(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.DO_NOTHING)
    street = models.CharField(max_length=200)
    state = models.CharField(max_length=50)
    number = models.PositiveIntegerField()
    post_code = models.CharField(max_length=6)
    city = models.CharField(max_length=100)
    