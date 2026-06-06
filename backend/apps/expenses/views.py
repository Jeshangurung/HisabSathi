from django.db.models import Q
from rest_framework import exceptions, viewsets

from apps.groups.models import GroupMember

from .models import Expense, ExpenseSplit
from .serializers import ExpenseSerializer, ExpenseSplitSerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        return (
            Expense.objects.filter(
                Q(created_by=self.request.user)
                | Q(paid_by=self.request.user)
                | Q(group__member_links__user=self.request.user)
            )
            .distinct()
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        group = serializer.validated_data["group"]
        if not GroupMember.objects.filter(group=group, user=self.request.user).exists():
            raise exceptions.PermissionDenied("Only group members can create expenses.")
        serializer.save()

    def perform_destroy(self, instance):
        is_owner = GroupMember.objects.filter(
            group=instance.group,
            user=self.request.user,
            role=GroupMember.Role.OWNER,
        ).exists()
        if instance.created_by != self.request.user and not is_owner:
            raise exceptions.PermissionDenied("Only the expense creator or group owner can delete this expense.")
        instance.delete()

    def perform_update(self, serializer):
        instance = serializer.instance
        is_owner = GroupMember.objects.filter(
            group=instance.group,
            user=self.request.user,
            role=GroupMember.Role.OWNER,
        ).exists()
        if instance.created_by != self.request.user and not is_owner:
            raise exceptions.PermissionDenied("Only the expense creator or group owner can update this expense.")
        serializer.save()


class ExpenseSplitViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSplitSerializer
    http_method_names = ["get", "head", "options"]

    def get_queryset(self):
        return ExpenseSplit.objects.filter(
            Q(user=self.request.user) | Q(expense__paid_by=self.request.user)
        ).distinct()
