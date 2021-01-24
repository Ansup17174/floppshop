from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import ShippingAddress
import re


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        exclude = ('id',)

    def validate_post_code(self, post_code):
        if not re.match(r"^\d\d-\d\d\d$", post_code):
            raise ValidationError('Invalid post code')
        return post_code
