from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.groups.models import ExpenseGroup, GroupMember
from apps.reminders.models import Reminder
from apps.settlements.models import Settlement

from .models import Expense, ExpenseSplit


User = get_user_model()


class ExpenseApiTests(APITestCase):
    def setUp(self):
        self.payer = User.objects.create_user(username="payer", password="strong-password")
        self.friend = User.objects.create_user(username="friend", password="strong-password")
        self.group = ExpenseGroup.objects.create(name="Trip", created_by=self.payer)
        GroupMember.objects.create(group=self.group, user=self.payer, role=GroupMember.Role.OWNER)
        GroupMember.objects.create(group=self.group, user=self.friend)
        self.client.force_authenticate(user=self.payer)

    def test_equal_split_excludes_payer_and_creates_settlement(self):
        response = self.client.post(
            "/api/expenses/",
            {
                "group": self.group.id,
                "title": "Dinner",
                "total_amount": "100.00",
                "paid_by": self.payer.id,
                "split_type": Expense.SplitType.EQUAL,
                "split_participant_ids": [self.payer.id, self.friend.id],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        expense = Expense.objects.get(title="Dinner")
        split = ExpenseSplit.objects.get(expense=expense, user=self.friend)
        self.assertEqual(split.amount_owed, Decimal("50.00"))
        self.assertFalse(ExpenseSplit.objects.filter(expense=expense, user=self.payer).exists())
        self.assertTrue(Settlement.objects.filter(expense=expense, from_user=self.friend, to_user=self.payer, amount=Decimal("50.00")).exists())
        self.assertTrue(Reminder.objects.filter(user=self.friend, reminder_type=Reminder.ReminderType.SETTLEMENT).exists())

    def test_custom_split_total_must_match_expense_total(self):
        response = self.client.post(
            "/api/expenses/",
            {
                "group": self.group.id,
                "title": "Hotel",
                "total_amount": "100.00",
                "paid_by": self.payer.id,
                "split_type": Expense.SplitType.CUSTOM,
                "custom_splits": [{"user": self.friend.id, "amount": "90.00"}],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
