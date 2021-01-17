from rest_framework.test import APITestCase
from django.shortcuts import reverse
from django.core import mail
from django.contrib.auth import get_user_model
from .serializers import CustomUserDetailsSerializer
import json
import re

User = get_user_model()


class UserRegisterAndLoginTestCase(APITestCase):

    def setUp(self):
        self.email = "janusz@op.pl"
        self.password = "krowa123"
        self.first_name = "Januszaaa"
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
        register_request = {
            "email": self.email,
            "password1": self.password,
            "password2": self.password,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone": self.phone,
            "date_of_birth": self.date_of_birth
        }

        self.client.post(reverse("rest_register"), register_request, format="json")
        key = re.search(r"MQ:[a-zA-Z0-9-_:]+", mail.outbox[0].body)
        if not key:
            raise AssertionError
        email_confirmation_request = {"key": key.group(0)}
        self.client.post(
            reverse("rest_verify_email"),
            email_confirmation_request,
            format="json"
        )

        login_request = {
            "email": self.email,
            "password": self.password
        }
        login_response = self.client.post(reverse("rest_login"), login_request, format="json")
        self.assertEqual(login_response.status_code, 200)
        user_from_db_serializer = CustomUserDetailsSerializer(User.objects.get(email=self.email))
        self.assertEqual(login_response.data.get("user"), user_from_db_serializer.data)
        self.assertEqual(login_response.cookies.get("floppauth").value, login_response.data.get("access_token"))


class UserEditTestCase(APITestCase):

    def setUp(self):
        self.email = "janusz@op.pl"
        self.password = "krowa123"
        self.first_name = "Januszaaa"
        self.last_name = "Tracz"
        self.phone = "666691337"
        self.date_of_birth = "2000-01-04"
        request_body = {
            "email": self.email,
            "password1": self.password,
            "password2": self.password,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone": self.phone,
            "date_of_birth": self.date_of_birth
        }
        self.client.post(reverse("rest_register"), request_body, format="json")
        key = re.search(r"MQ:[a-zA-Z0-9-_:]+", mail.outbox[0].body)
        if not key:
            raise AssertionError
        email_confirmation_request = {"key": key.group(0)}
        self.client.post(
            reverse("rest_verify_email"),
            email_confirmation_request,
            format="json"
        )
        login_request = {
            "email": self.email,
            "password": self.password
        }
        self.client.post(reverse("rest_login"), login_request, format="json")

    def test_user_change_password(self):
        request_body = {
            "old_password": self.password,
            "new_password1": "nowehaslo1337",
            "new_password2": "nowehaslo1337"
        }
        response = self.client.post(reverse("rest_password_change"), request_body, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'detail': 'New password has been saved.'})
        user = User.objects.get(email="janusz@op.pl")
        self.assertTrue(user.check_password("nowehaslo1337"))
        self.assertFalse(user.check_password(self.password))

    def test_user_change_password_invalid(self):
        request_body = {
            "old_password": self.password,
            "new_password1": "nowehaslo1337",
            "new_password2": "cosinnego"
        }
        response = self.client.post(reverse("rest_password_change"), request_body, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.dumps(response.data), json.dumps({
            "new_password2": ["The two password fields didn\u2019t match."]
        }))
