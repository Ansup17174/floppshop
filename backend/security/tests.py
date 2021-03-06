from rest_framework.test import APITestCase
from django.test import tag
from django.shortcuts import reverse
from django.core import mail
from django.contrib.auth import get_user_model
from .serializers import CustomUserDetailsSerializer
import json
import re

User = get_user_model()


@tag("auth")
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
        key = re.search(r"MQ:[a-zA-Z0-9-_:]+", mail.outbox[-1].body)
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
        key = re.search(r"/verify-email/([a-zA-Z0-9-_:]+)", mail.outbox[-1].body)
        if not key:
            raise AssertionError
        email_confirmation_request = {"key": key.group(1)}
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


@tag("auth")
class UserTestCase(APITestCase):

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
        key = re.search(r"/verify-email/([a-zA-Z0-9-_:]+)", mail.outbox[-1].body)
        if not key:
            raise AssertionError
        email_confirmation_request = {"key": key.group(1)}
        self.client.post(
            reverse("rest_verify_email"),
            email_confirmation_request,
            format="json"
        )
        login_request = {
            "email": self.email,
            "password": self.password
        }
        self.response = self.client.post(reverse("rest_login"), login_request, format="json")

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

    def test_user_reset_password(self):
        reset_request = {"email": self.email}
        reset_response = self.client.post(reverse("rest_password_reset"), reset_request, format="json")
        self.assertEqual(reset_response.status_code, 200)
        self.assertEqual(reset_response.data, {"detail": "Password reset e-mail has been sent."})
        body = mail.outbox[-1].body
        uid_token = re.search(r"/reset/([\d\w]+)/([\w\d-]+)", body)
        confirm_request = {
            "uid": uid_token.group(1),
            "token": uid_token.group(2),
            "new_password1": "qgkghdkgjd",
            "new_password2": "qgkghdkgjd"
        }
        confirm_response = self.client.post(
            reverse("rest_password_reset_confirm"),
            confirm_request,
            format="json"
        )
        self.assertEqual(confirm_response.status_code, 200)
        self.assertEqual(confirm_response.data, {"detail": "Password has been reset with the new password."})
        login_request = {
            "email": self.email,
            "password": "qgkghdkgjd"
        }
        login_response = self.client.post(reverse("rest_login"), login_request, format="json")
        self.assertEqual(login_response.status_code, 200)
        self.assertEqual(login_response.cookies.get("floppauth").value, login_response.data.get("access_token"))

    def test_user_refresh_token(self):
        refresh_token = self.response.data.get("refresh_token")
        self.client.post(reverse("token_refresh"), {"refresh": refresh_token}, format="json")
        user_response = self.client.get(reverse("rest_user_details"))
        self.assertEqual(user_response.status_code, 200)

    def test_user_details_with_invalid_token(self):
        self.client.cookies['floppauth'] = "asdasf32fs.gdsdg2wsdg.sdg2wg3wesg"
        response = self.client.get(reverse("rest_user_details"))
        self.assertEqual(response.status_code, 401)

    def test_user_edit_profile(self):
        initial_data = self.response.data['user']
        request_data = {
            "phone": 123456789
        }
        edit_response = self.client.patch(reverse("rest_user_details"), request_data, format="json")
        self.assertEqual(edit_response.status_code, 200)
        self.assertEqual(edit_response.data, {**initial_data, "phone": 123456789})
        self.assertEqual(User.objects.get(email="janusz@op.pl").phone, 123456789)
