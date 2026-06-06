from django.db.models import Q
from django.utils import timezone
from rest_framework import decorators, response, status, viewsets

from .models import Loan
from .serializers import LoanSerializer


class LoanViewSet(viewsets.ModelViewSet):
    serializer_class = LoanSerializer

    def get_queryset(self):
        return Loan.objects.filter(
            Q(lender=self.request.user) | Q(borrower=self.request.user)
        ).order_by("-created_at")

    @decorators.action(detail=True, methods=["post"], url_path="mark-paid")
    def mark_paid(self, request, pk=None):
        loan = self.get_object()
        if request.user not in (loan.lender, loan.borrower):
            return response.Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)
        loan.status = Loan.Status.PAID
        loan.paid_at = timezone.now()
        loan.save(update_fields=["status", "paid_at", "updated_at"])
        return response.Response(self.get_serializer(loan).data)
