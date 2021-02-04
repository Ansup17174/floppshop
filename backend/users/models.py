from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
import uuid


class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    date_of_birth = models.DateField()
    phone = models.IntegerField()


class ShippingAddress(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    street = models.CharField(max_length=200, blank=False, null=False)
    state = models.CharField(max_length=50, blank=False, null=False)
    number = models.CharField(max_length=10, blank=False, null=False)
    post_code = models.CharField(max_length=6, blank=False, null=False)
    city = models.CharField(max_length=100, blank=False, null=False)


