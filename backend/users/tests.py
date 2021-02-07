from django.test import TestCase, tag
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from security.serializers import CustomRegisterSerializer
from datetime import date, timedelta


@tag("auth")
class UserSerializersValidationTestCase(TestCase):

    custom_register_serializer = CustomRegisterSerializer()

    def test_validate_phone(self):
        phone1 = 123456789
        phone2 = 124124
        phone3 = 111111111
        phone4 = "123456789"
        phone5 = "123-56-89"
        self.assertEqual(phone1, self.custom_register_serializer.validate_phone(phone1))
        self.assertRaises(ValidationError, self.custom_register_serializer.validate_phone, phone2)
        self.assertEqual(phone3, self.custom_register_serializer.validate_phone(phone3))
        self.assertEqual(phone4, self.custom_register_serializer.validate_phone(phone4))
        self.assertRaises(ValidationError, self.custom_register_serializer.validate_phone, phone5)

    def test_validate_date_of_birth(self):
        date1 = date(2000, 1, 1)
        date2 = date(1000, 1, 1)
        date3 = timezone.now().date() + timedelta(days=1)
        self.assertEqual(date1, self.custom_register_serializer.validate_date_of_birth(date1))
        self.assertRaises(ValidationError, self.custom_register_serializer.validate_date_of_birth, date2)
        self.assertRaises(ValidationError, self.custom_register_serializer.validate_date_of_birth, date3)
