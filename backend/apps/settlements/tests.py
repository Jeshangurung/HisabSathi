from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.expenses.models import Expense, ExpenseSplit
from apps.groups.models import ExpenseGroup, GroupMember

from .models import Settlement


User = get_user_model()


class SettlementApiTests(APITestCase):
    def setUp(self):
        self.receiver = User.objects.create_user(username="receiver", password="strong-password")
        self.debtor = User.objects.create_user(username="debtor", password="strong-password")
        self.group = ExpenseGroup.objects.create(name="Trip", created_by=self.receiver)
        GroupMember.objects.create(group=self.group, user=self.receiver, role=GroupMember.Role.OWNER)
        GroupMember.objects.create(group=self.group, user=self.debtor)
        self.expense = Expense.objects.create(
            group=self.group,
            title="Taxi",
            total_amount=Decimal("200.00"),
            paid_by=self.receiver,
            created_by=self.receiver,
            split_type=Expense.SplitType.EQUAL,
            expense_date="2026-06-06",
        )
        self.split = ExpenseSplit.objects.create(expense=self.expense, user=self.debtor, amount_owed=Decimal("100.00"))
        self.settlement = Settlement.objects.create(
            group=self.group,
            expense=self.expense,
            from_user=self.debtor,
            to_user=self.receiver,
            amount=Decimal("100.00"),
        )

    def test_debtor_marks_paid_and_receiver_confirms(self):
        self.client.force_authenticate(user=self.debtor)
        paid_response = self.client.post(
            f"/api/settlements/{self.settlement.id}/mark-paid/",
            {"payment_method": "eSewa"},
            format="json",
        )

        self.assertEqual(paid_response.status_code, status.HTTP_200_OK)
        self.split.refresh_from_db()
        self.assertEqual(self.split.status, ExpenseSplit.Status.MARKED_PAID)

        self.client.force_authenticate(user=self.receiver)
        confirm_response = self.client.post(f"/api/settlements/{self.settlement.id}/confirm-received/", format="json")

        self.assertEqual(confirm_response.status_code, status.HTTP_200_OK)
        self.split.refresh_from_db()
        self.assertEqual(self.split.status, ExpenseSplit.Status.CONFIRMED)
