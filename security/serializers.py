from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.utils import timezone
from datetime import date
import re


class CustomRegisterSerializer(RegisterSerializer):

    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    date_of_birth = serializers.DateField()
    phone = serializers.IntegerField()

    def validate_phone(self, phone):
        if not re.search(r"^\d{9}$", str(phone)):
            raise ValidationError("Invalid phone number")
        return phone

    def validate_date_of_birth(self, date_of_birth):
        # TODO naprawic to tutaj
        if date_of_birth > timezone.now().date() or date_of_birth < date(1900, 1, 1):
            raise ValidationError("Invalid date of birth")
        return date_of_birth

    def get_cleaned_data(self):
        return {
            'password1': self.validated_data.get('password1', ''),
            'password2': self.validated_data.get('password2', ''),
            'email': self.validated_data.get('email', ''),
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'date_of_birth': self.validated_data.get('date_of_birth', ''),
            'phone': self.validated_data.get('phone', '')
        }
