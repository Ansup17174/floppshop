from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.shortcuts import reverse
from django.test import override_settings
from django.core import mail
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Item, ItemImage
from pathlib import Path
from decimal import Decimal
import os
import re
import shutil


User = get_user_model()


@override_settings(MEDIA_ROOT=settings.MEDIA_ROOT + "test")
class ItemImageTestCase(APITestCase):

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
        key = re.search(r"\w\w:[a-zA-Z0-9-_:]+", mail.outbox[0].body)
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
        self.user = User.objects.get(email=self.email)
        self.user.is_staff = True
        self.user.save()
        self.cat_food = Item.objects.create(
            name="Cat food(chicken) - 1kg",
            price=Decimal("10.99"),
            quantity=100,
            description="Cat food for cats",
        )

    def test_admin_create_item_with_image(self):
        with open(Path(__file__).resolve().parent.parent / "test.jpg", "rb") as image_file:
            uploaded_file = SimpleUploadedFile(
                image_file.name,
                image_file.read(),
                content_type="multipart/form-data"
            )
            response = self.client.post(
                reverse("shop-admin-list"),
                {
                    "name": "Food",
                    "price": Decimal("10.99"),
                    "description": "Cat food",
                    "quantity": 10,
                    "images": uploaded_file
                }
            )
            self.assertEqual(response.status_code, 201)
            item = Item.objects.get(name="Food")
            self.assertTrue(os.path.isfile(item.images.all().first().image.path))

    def test_assigning_images_to_item(self):
        with open(Path(__file__).resolve().parent.parent / "test.jpg", "rb") as image:
            image1 = SimpleUploadedFile("image1.jpg", image.read(), content_type="multipart/form-data")
            image2 = SimpleUploadedFile("image2.jpg", image.read(), content_type="multipart/form-data")
            image3 = SimpleUploadedFile("image3.jpg", image.read(), content_type="multipart/form-data")
            response = self.client.patch(
                reverse("shop-admin-detail", args=(self.cat_food.pk,)),
                {
                    "images": [image1, image2, image3]
                }
            )
            self.assertEqual(response.status_code, 200)
            self.assertEqual(ItemImage.objects.all().count(), 3)

    def test_delete_item_image(self):
        with open(Path(__file__).resolve().parent.parent / "test.jpg", "rb") as image_file:
            image_uploaded_file = SimpleUploadedFile(
                image_file.name, image_file.read(),
                content_type="multipart/form-data"
            )
            self.client.patch(
                reverse("shop-admin-detail", args=(self.cat_food.pk,)),
                {"images": image_uploaded_file}
            )
            image = self.cat_food.images.all().first()
            remove_response = self.client.delete(reverse("delete_image_view", args=(image.pk,)))
            self.assertEqual(remove_response.status_code, 204)

    def tearDown(self):
        media_path = Path(__file__).resolve().parent.parent / "mediatest"
        if os.path.isdir(media_path):
            shutil.rmtree(media_path)
