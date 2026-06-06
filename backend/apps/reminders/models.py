from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel


class Reminder(TimeStampedModel):
    class ReminderType(models.TextChoices):
        SETTLEMENT = "settlement", "Settlement"
        LOAN = "loan", "Loan"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reminders")
    reminder_type = models.CharField(max_length=20, choices=ReminderType.choices)
    title = models.CharField(max_length=160)
    body = models.TextField(blank=True)
    due_at = models.DateTimeField(blank=True, null=True)
    is_read = models.BooleanField(default=False)
    settlement = models.ForeignKey(
        "settlements.Settlement",
        on_delete=models.CASCADE,
        related_name="reminders",
        blank=True,
        null=True,
    )
    loan = models.ForeignKey(
        "loans.Loan",
        on_delete=models.CASCADE,
        related_name="reminders",
        blank=True,
        null=True,
    )

    def __str__(self):
        return self.title
