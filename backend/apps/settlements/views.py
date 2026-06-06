from django.db.models import Q
from django.utils import timezone
from rest_framework import decorators, response, status, viewsets

from apps.expenses.models import ExpenseSplit
from apps.groups.models import GroupMember
from apps.reminders.models import Reminder

from .models import Settlement
from .serializers import SettlementSerializer


class SettlementViewSet(viewsets.ModelViewSet):
    serializer_class = SettlementSerializer

    def get_queryset(self):
        return Settlement.objects.filter(
            Q(from_user=self.request.user) | Q(to_user=self.request.user)
        ).order_by("-created_at")

    def perform_create(self, serializer):
        group = serializer.validated_data["group"]
        if not GroupMember.objects.filter(group=group, user=self.request.user).exists():
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Only group members can create settlements.")
        serializer.save()

    @decorators.action(detail=True, methods=["post"], url_path="mark-paid")
    def mark_paid(self, request, pk=None):
        settlement = self.get_object()
        if settlement.from_user != request.user:
            return response.Response(
                {"detail": "Only the user who owes money can mark this settlement as paid."},
                status=status.HTTP_403_FORBIDDEN,
            )
        settlement.status = Settlement.Status.MARKED_PAID
        settlement.marked_paid_at = timezone.now()
        settlement.payment_method = request.data.get("payment_method", settlement.payment_method)
        settlement.transaction_note = request.data.get("transaction_note", settlement.transaction_note)
        if "proof_image" in request.FILES:
            settlement.proof_image = request.FILES["proof_image"]
        settlement.save(update_fields=["status", "marked_paid_at", "payment_method", "transaction_note", "proof_image", "updated_at"])
        if settlement.expense_id:
            ExpenseSplit.objects.filter(expense=settlement.expense, user=settlement.from_user).update(status=ExpenseSplit.Status.MARKED_PAID)
        Reminder.objects.create(
            user=settlement.to_user,
            title="Payment proof ready for review",
            message=f"{settlement.from_user.get_username()} marked {settlement.amount} as paid.",
            reminder_type=Reminder.ReminderType.SETTLEMENT,
            settlement=settlement,
        )
        return response.Response(self.get_serializer(settlement).data)

    @decorators.action(detail=True, methods=["post"], url_path="confirm-received")
    def confirm_received(self, request, pk=None):
        settlement = self.get_object()
        if settlement.to_user != request.user:
            return response.Response(
                {"detail": "Only the receiver can confirm this settlement."},
                status=status.HTTP_403_FORBIDDEN,
            )
        settlement.status = Settlement.Status.CONFIRMED
        settlement.confirmed_at = timezone.now()
        settlement.save(update_fields=["status", "confirmed_at", "updated_at"])
        if settlement.expense_id:
            ExpenseSplit.objects.filter(expense=settlement.expense, user=settlement.from_user).update(status=ExpenseSplit.Status.CONFIRMED)
        return response.Response(self.get_serializer(settlement).data)

    @decorators.action(detail=True, methods=["post"], url_path="reject")
    def reject(self, request, pk=None):
        settlement = self.get_object()
        if settlement.to_user != request.user:
            return response.Response(
                {"detail": "Only the receiver can reject this settlement."},
                status=status.HTTP_403_FORBIDDEN,
            )
        settlement.status = Settlement.Status.REJECTED
        settlement.transaction_note = request.data.get("transaction_note", settlement.transaction_note)
        settlement.save(update_fields=["status", "transaction_note", "updated_at"])
        if settlement.expense_id:
            ExpenseSplit.objects.filter(expense=settlement.expense, user=settlement.from_user).update(status=ExpenseSplit.Status.PENDING)
        Reminder.objects.create(
            user=settlement.from_user,
            title="Payment proof rejected",
            message=f"{settlement.to_user.get_username()} rejected a settlement proof.",
            reminder_type=Reminder.ReminderType.SETTLEMENT,
            settlement=settlement,
        )
        return response.Response(self.get_serializer(settlement).data)

    @decorators.action(detail=False, methods=["get"], url_path="pending")
    def pending(self, request):
        queryset = self.get_queryset().filter(status__in=[Settlement.Status.PENDING, Settlement.Status.MARKED_PAID])
        return response.Response(self.get_serializer(queryset, many=True).data)

    @decorators.action(detail=False, methods=["get"], url_path="i-owe")
    def i_owe(self, request):
        queryset = self.get_queryset().filter(from_user=request.user, status__in=[Settlement.Status.PENDING, Settlement.Status.MARKED_PAID])
        return response.Response(self.get_serializer(queryset, many=True).data)

    @decorators.action(detail=False, methods=["get"], url_path="owed-to-me")
    def owed_to_me(self, request):
        queryset = self.get_queryset().filter(to_user=request.user, status__in=[Settlement.Status.PENDING, Settlement.Status.MARKED_PAID])
        return response.Response(self.get_serializer(queryset, many=True).data)
