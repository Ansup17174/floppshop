from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from datetime import date
from django.contrib.auth import get_user_model
from .models import ShippingAddress
import re


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        exclude = ('user',)

    def validate_post_code(self, post_code):
        if not re.match(r"^\d\d-\d\d\d$", post_code):
            raise ValidationError('Invalid post code')
        return post_code


class EditProfileSerializer(serializers.ModelSerializer):

    shipping_address = ShippingAddressSerializer()

    class Meta:
        model = get_user_model()
        fields = ('first_name', 'last_name', 'phone', 'date_of_birth', 'shipping_address')

    def validate_phone(self, phone):
        if not re.search(r"^\d{9}$"):
            raise ValidationError("Invalid phone number")
        return phone

    def validate_date_of_birth(self, date_of_birth):
        if date_of_birth > timezone.now() or date_of_birth < date(1900, 1, 1):
            raise ValidationError("Invalid date of birth")
        return date_of_birth
