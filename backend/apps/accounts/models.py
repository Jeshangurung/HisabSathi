from django.contrib.auth.models import AbstractUser
from django.db import models

from apps.common.models import TimeStampedModel


class User(AbstractUser):
    full_name = models.CharField(max_length=150, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    def __str__(self):
        return self.full_name or self.username


class PaymentProfile(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="payment_profile")
    phone_number = models.CharField(max_length=20, blank=True)
    esewa_number = models.CharField(max_length=20, blank=True)
    khalti_number = models.CharField(max_length=20, blank=True)
    bank_name = models.CharField(max_length=120, blank=True)
    bank_account_name = models.CharField(max_length=120, blank=True)
    bank_account_number = models.CharField(max_length=60, blank=True)
    payment_qr = models.ImageField(upload_to="payment_qr/", blank=True, null=True)

    def __str__(self):
        return f"Payment profile for {self.user}"
