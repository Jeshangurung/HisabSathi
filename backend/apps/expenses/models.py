from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel


class Expense(TimeStampedModel):
    class SplitType(models.TextChoices):
        EQUAL = "equal", "Equal"
        CUSTOM = "custom", "Custom"

    group = models.ForeignKey("groups.ExpenseGroup", on_delete=models.CASCADE, related_name="expenses")
    title = models.CharField(max_length=160)
    notes = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    paid_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="paid_expenses")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="created_expenses")
    split_type = models.CharField(max_length=20, choices=SplitType.choices, default=SplitType.EQUAL)
    receipt_image = models.ImageField(upload_to="expense_receipts/", blank=True, null=True)

    def __str__(self):
        return self.title


class ExpenseSplit(TimeStampedModel):
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name="splits")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="expense_splits")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    is_paid = models.BooleanField(default=False)

    class Meta:
        unique_together = ("expense", "user")

    def __str__(self):
        return f"{self.user} owes {self.amount} for {self.expense}"
