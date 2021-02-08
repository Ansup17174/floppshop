from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from dj_rest_auth.serializers import UserDetailsSerializer, PasswordResetSerializer
from django.contrib.auth import get_user_model
from dj_rest_auth.registration.serializers import RegisterSerializer
from allauth.account.models import EmailAddress
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

    def validate_phone(self, phone):
        if not re.search(r"^\d{9}$", str(phone)):
            raise ValidationError("Invalid phone number")
        return phone

    def validate_first_name(self, first_name):
        if not first_name:
            raise ValidationError("This field may not be blank")
        return first_name

    def validate_last_name(self, last_name):
        if not last_name:
            raise ValidationError("This field may not be blank")
        return last_name

    def validate_date_of_birth(self, date_of_birth):
        if date_of_birth > timezone.now().date() or date_of_birth < date(1900, 1, 1):
            raise ValidationError("Invalid date of birth")
        return date_of_birth

    class Meta:
        extra_fields = []
        if hasattr(UserModel, "EMAIL_FIELD"):
            extra_fields.append(UserModel.EMAIL_FIELD)
    
        model = UserModel
        fields = ('pk', *extra_fields, 'first_name', 'last_name', 'date_of_birth', 'phone', 'is_staff')
        read_only_fields = ('email', 'is_staff')


class CustomPasswordResetSerializer(PasswordResetSerializer):

    def validate_email(self, value):
        if not EmailAddress.objects.filter(verified=True, email=value).exists():
            raise ValidationError("No user found with this e-mail address")
        self.reset_form = self.password_reset_form_class(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(self.reset_form.errors)

