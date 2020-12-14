from rest_framework import serializers
from rest_framework.exceptions import ValidationError
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
