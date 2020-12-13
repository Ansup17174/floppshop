from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    date_of_birth = models.DateField()


class ShippingAddress(models.Model):
    street = models.CharField(max_length=200)
    number = models.CharField(max_length=20)
    post_code = models.CharField(max_length=6)
    city = models.CharField(max_length=100)
