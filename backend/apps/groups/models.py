from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel


class ExpenseGroup(TimeStampedModel):
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_expense_groups",
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through="GroupMember",
        related_name="expense_groups",
    )

    def __str__(self):
        return self.name


class GroupMember(TimeStampedModel):
    class Role(models.TextChoices):
        OWNER = "owner", "Owner"
        MEMBER = "member", "Member"

    group = models.ForeignKey(ExpenseGroup, on_delete=models.CASCADE, related_name="member_links")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="group_memberships")
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.MEMBER)

    class Meta:
        unique_together = ("group", "user")

    def __str__(self):
        return f"{self.user} in {self.group}"
