from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Reminder


User = get_user_model()


class ReminderApiTests(APITestCase):
    def test_mark_all_read_updates_current_user_reminders(self):
        user = User.objects.create_user(username="user", password="strong-password")
        other = User.objects.create_user(username="other", password="strong-password")
        Reminder.objects.create(user=user, title="Pay Sita", reminder_type=Reminder.ReminderType.SETTLEMENT)
        Reminder.objects.create(user=other, title="Pay Ram", reminder_type=Reminder.ReminderType.SETTLEMENT)
        self.client.force_authenticate(user=user)

        response = self.client.post("/api/reminders/mark-all-read/", format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["updated"], 1)
        self.assertFalse(Reminder.objects.get(user=other).is_read)
