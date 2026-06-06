from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.reminders.models import Reminder

from .models import Loan


User = get_user_model()


class LoanApiTests(APITestCase):
    def setUp(self):
        self.lender = User.objects.create_user(username="lender", password="strong-password")
        self.borrower = User.objects.create_user(username="borrower", password="strong-password")

    def test_create_due_soon_loan_generates_reminder(self):
        self.client.force_authenticate(user=self.lender)

        response = self.client.post(
            "/api/loans/",
            {
                "lender": self.lender.id,
                "borrower": self.borrower.id,
                "amount": "500.00",
                "reason": "Bus fare",
                "due_date": str(timezone.localdate() + timedelta(days=1)),
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        loan = Loan.objects.get(reason="Bus fare")
        self.assertTrue(Reminder.objects.filter(user=self.borrower, loan=loan).exists())

    def test_borrower_marks_paid_and_lender_confirms(self):
        loan = Loan.objects.create(lender=self.lender, borrower=self.borrower, amount="500.00")

        self.client.force_authenticate(user=self.borrower)
        paid_response = self.client.post(f"/api/loans/{loan.id}/mark-paid/", format="json")
        self.assertEqual(paid_response.status_code, status.HTTP_200_OK)

        self.client.force_authenticate(user=self.lender)
        confirm_response = self.client.post(f"/api/loans/{loan.id}/confirm-paid/", format="json")
        self.assertEqual(confirm_response.status_code, status.HTTP_200_OK)
        loan.refresh_from_db()
        self.assertEqual(loan.status, Loan.Status.PAID)
