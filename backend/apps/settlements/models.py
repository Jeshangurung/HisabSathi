from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel


class Settlement(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        MARKED_PAID = "marked_paid", "Marked paid"
        CONFIRMED = "confirmed", "Confirmed"
        REJECTED = "rejected", "Rejected"

    group = models.ForeignKey("groups.ExpenseGroup", on_delete=models.CASCADE, related_name="settlements")
    expense = models.ForeignKey(
        "expenses.Expense",
        on_delete=models.CASCADE,
        related_name="settlements",
        blank=True,
        null=True,
    )
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="settlements_to_pay")
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="settlements_to_receive")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    payment_method = models.CharField(max_length=80, blank=True)
    proof_image = models.ImageField(upload_to="settlement_proofs/", blank=True, null=True)
    transaction_note = models.TextField(blank=True)
    marked_paid_at = models.DateTimeField(blank=True, null=True)
    confirmed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.from_user} pays {self.to_user}: {self.amount}"
