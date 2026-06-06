from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel


class Loan(TimeStampedModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        MARKED_PAID = "marked_paid", "Marked paid"
        PAID = "paid", "Paid"
        CANCELLED = "cancelled", "Cancelled"

    lender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="loans_given")
    borrower = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="loans_taken")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    reason = models.TextField(blank=True)
    due_date = models.DateField(blank=True, null=True)
    proof_image = models.ImageField(upload_to="loan_proofs/", blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    paid_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.lender} lent {self.amount} to {self.borrower}"
