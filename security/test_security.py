from rest_framework.test import APITestCase
from django.shortcuts import reverse
from django.core import mail
from django.contrib.auth import get_user_model
import re

User = get_user_model()


class UserRegisterTestCase(APITestCase):

    def setUp(self):
        self.email = "janusz@op.pl"
        self.password = "krowa123"
        self.first_name = "Janusz"
        self.last_name = "Tracz"
        self.phone = "666691337"
        self.date_of_birth = "2000-01-04"

    def test_register_new_user(self):
        request_body = {
            "email": self.email,
            "password1": self.password,
            "password2": self.password,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone": self.phone,
            "date_of_birth": self.date_of_birth
        }

        response = self.client.post(reverse("rest_register"), request_body, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data, {'detail': 'Verification e-mail sent.'})
        key = re.search(r"MQ:[a-zA-Z0-9-_:]+", mail.outbox[0].body)
        if not key:
            raise AssertionError
        email_confirmation_request = {"key": key.group(0)}
        email_confirmation_response = self.client.post(
            reverse("rest_verify_email"),
            email_confirmation_request,
            format="json"
        )
        self.assertEqual(email_confirmation_response.status_code, 200)
        self.assertEqual(email_confirmation_response.data, {'detail': 'ok'})
        self.assertTrue(User.objects.filter(email="janusz@op.pl").exists())

    def test_user_login(self):
        

