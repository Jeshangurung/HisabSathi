from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.groups.models import ExpenseGroup, GroupMember
from apps.loans.models import Loan
from apps.reminders.models import Reminder
from apps.settlements.models import Settlement


User = get_user_model()


class DashboardSummaryTests(APITestCase):
    def test_dashboard_returns_money_and_recent_records(self):
        user = User.objects.create_user(username="user", password="strong-password")
        friend = User.objects.create_user(username="friend", password="strong-password")
        group = ExpenseGroup.objects.create(name="Trip", created_by=user)
        GroupMember.objects.create(group=group, user=user, role=GroupMember.Role.OWNER)
        GroupMember.objects.create(group=group, user=friend)
        Settlement.objects.create(group=group, from_user=user, to_user=friend, amount=Decimal("75.00"))
        Settlement.objects.create(group=group, from_user=friend, to_user=user, amount=Decimal("125.00"))
        Loan.objects.create(lender=user, borrower=friend, amount=Decimal("300.00"))
        Reminder.objects.create(user=user, title="Check payment", reminder_type=Reminder.ReminderType.SETTLEMENT)
        self.client.force_authenticate(user=user)

        response = self.client.get("/api/dashboard/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["total_amount_i_owe"], Decimal("75.00"))
        self.assertEqual(response.data["data"]["total_amount_i_am_owed"], Decimal("125.00"))
        self.assertEqual(response.data["data"]["active_loans_given_count"], 1)
