from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from dj_rest_auth.serializers import UserDetailsSerializer
from django.contrib.auth import get_user_model
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.utils import timezone
from datetime import date
import re

UserModel = get_user_model()


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


class CustomUserDetailsSerializer(UserDetailsSerializer):
    class Meta:
        extra_fields = []
        if hasattr(UserModel, "EMAIL_FIELD"):
            extra_fields.append(UserModel.EMAIL_FIELD)
    
        model = UserModel
        fields = ('pk', *extra_fields, 'first_name', 'last_name', 'date_of_birth', 'phone', 'is_staff')
        read_only_fields = ('email',)


class PayUBuyerSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=50)
    phone = serializers.CharField(max_length=12)
    firstName = serializers.CharField(max_length=200)
    lastName = serializers.CharField(max_length=200)
    language = serializers.CharField(max_length=10)


class PayUProductSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    unitPrice = serializers.CharField(max_length=100)
    quantity = serializers.CharField(max_length=30)


class PayUOrderSerializer(serializers.Serializer):
    notifyUrl = serializers.CharField(max_length=100, required=False)
    customerIp = serializers.CharField(max_length=20)
    merchantPosId = serializers.CharField(max_length=6)
    description = serializers.CharField(max_length=200)
    currencyCode = serializers.CharField(max_length=5)
    totalAmount = serializers.CharField(max_length=100)

    buyer = PayUBuyerSerializer()
    products = PayUProductSerializer(many=True)
