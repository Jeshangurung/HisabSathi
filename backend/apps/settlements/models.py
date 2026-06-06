from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel


class Settlement(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        CONFIRMED = "confirmed", "Confirmed"
        REJECTED = "rejected", "Rejected"

    group = models.ForeignKey("groups.ExpenseGroup", on_delete=models.CASCADE, related_name="settlements")
    payer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="settlements_to_pay")
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="settlements_to_receive")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    payment_proof = models.ImageField(upload_to="settlement_proofs/", blank=True, null=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    confirmed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.payer} pays {self.receiver}: {self.amount}"
