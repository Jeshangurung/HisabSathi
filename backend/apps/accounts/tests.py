from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import PaymentProfile


User = get_user_model()


class AccountApiTests(APITestCase):
    def test_register_returns_tokens_and_creates_payment_profile(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "username": "sita",
                "email": "sita@example.com",
                "full_name": "Sita Gurung",
                "phone_number": "9800000000",
                "password": "strong-password",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        user = User.objects.get(username="sita")
        self.assertTrue(PaymentProfile.objects.filter(user=user, phone_number="9800000000").exists())

    def test_token_login_accepts_email_or_username(self):
        User.objects.create_user(username="hari", email="hari@example.com", password="strong-password")

        username_response = self.client.post(
            "/api/auth/token/",
            {"username": "hari", "password": "strong-password"},
            format="json",
        )
        email_response = self.client.post(
            "/api/auth/token/",
            {"username": "hari@example.com", "password": "strong-password"},
            format="json",
        )

        self.assertEqual(username_response.status_code, status.HTTP_200_OK)
        self.assertEqual(email_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", email_response.data)

    def test_current_user_endpoint_updates_profile(self):
        user = User.objects.create_user(username="ram", password="strong-password")
        self.client.force_authenticate(user=user)

        response = self.client.patch("/api/auth/me/", {"full_name": "Ram Thapa"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertEqual(user.full_name, "Ram Thapa")
