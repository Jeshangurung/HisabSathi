from datetime import timedelta

from django.db.models import Q
from django.utils import timezone
from rest_framework import decorators, exceptions, response, status, viewsets

from apps.reminders.models import Reminder

from .models import Loan
from .serializers import LoanSerializer


class LoanViewSet(viewsets.ModelViewSet):
    serializer_class = LoanSerializer

    def get_queryset(self):
        return Loan.objects.filter(
            Q(lender=self.request.user) | Q(borrower=self.request.user)
        ).order_by("-created_at")

    def perform_create(self, serializer):
        lender = serializer.validated_data["lender"]
        borrower = serializer.validated_data["borrower"]
        if self.request.user not in (lender, borrower):
            raise exceptions.PermissionDenied("You can only create loans where you are the lender or borrower.")
        loan = serializer.save()
        self._create_due_reminders(loan)

    def perform_update(self, serializer):
        loan = serializer.instance
        if self.request.user != loan.lender:
            raise exceptions.PermissionDenied("Only the lender can update loan details.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.lender:
            raise exceptions.PermissionDenied("Only the lender can delete this loan.")
        instance.delete()

    @decorators.action(detail=True, methods=["post"], url_path="mark-paid")
    def mark_paid(self, request, pk=None):
        loan = self.get_object()
        if request.user != loan.borrower:
            return response.Response({"detail": "Only the borrower can mark this loan as paid."}, status=status.HTTP_403_FORBIDDEN)
        loan.status = Loan.Status.MARKED_PAID
        if "proof_image" in request.FILES:
            loan.proof_image = request.FILES["proof_image"]
        loan.save(update_fields=["status", "proof_image", "updated_at"])
        Reminder.objects.create(
            user=loan.lender,
            title="Loan payment needs confirmation",
            message=f"{loan.borrower.get_username()} marked a loan of {loan.amount} as paid.",
            reminder_type=Reminder.ReminderType.LOAN,
            loan=loan,
        )
        return response.Response(self.get_serializer(loan).data)

    @decorators.action(detail=True, methods=["post"], url_path="confirm-paid")
    def confirm_paid(self, request, pk=None):
        loan = self.get_object()
        if request.user != loan.lender:
            return response.Response({"detail": "Only the lender can confirm this loan payment."}, status=status.HTTP_403_FORBIDDEN)
        loan.status = Loan.Status.PAID
        loan.paid_at = timezone.now()
        loan.save(update_fields=["status", "paid_at", "updated_at"])
        return response.Response(self.get_serializer(loan).data)

    @decorators.action(detail=True, methods=["post"], url_path="cancel")
    def cancel(self, request, pk=None):
        loan = self.get_object()
        if request.user != loan.lender:
            return response.Response({"detail": "Only the lender can cancel this loan."}, status=status.HTTP_403_FORBIDDEN)
        loan.status = Loan.Status.CANCELLED
        loan.save(update_fields=["status", "updated_at"])
        return response.Response(self.get_serializer(loan).data)

    @decorators.action(detail=False, methods=["get"], url_path="given")
    def given(self, request):
        queryset = self.get_queryset().filter(lender=request.user)
        return response.Response(self.get_serializer(queryset, many=True).data)

    @decorators.action(detail=False, methods=["get"], url_path="borrowed")
    def borrowed(self, request):
        queryset = self.get_queryset().filter(borrower=request.user)
        return response.Response(self.get_serializer(queryset, many=True).data)

    @decorators.action(detail=False, methods=["get"], url_path="overdue")
    def overdue(self, request):
        queryset = self.get_queryset().filter(
            due_date__lt=timezone.localdate(),
            status__in=[Loan.Status.ACTIVE, Loan.Status.MARKED_PAID],
        )
        return response.Response(self.get_serializer(queryset, many=True).data)

    def _create_due_reminders(self, loan):
        if not loan.due_date or loan.status != Loan.Status.ACTIVE:
            return
        today = timezone.localdate()
        if loan.due_date < today:
            title = "Loan is overdue"
            message = f"Loan of {loan.amount} was due on {loan.due_date}."
        elif loan.due_date <= today + timedelta(days=3):
            title = "Loan due soon"
            message = f"Loan of {loan.amount} is due on {loan.due_date}."
        else:
            return
        Reminder.objects.create(
            user=loan.borrower,
            title=title,
            message=message,
            reminder_type=Reminder.ReminderType.LOAN,
            loan=loan,
        )
