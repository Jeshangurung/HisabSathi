from django.db.models import Q
from django.utils import timezone
from rest_framework import decorators, response, status, viewsets

from .models import Settlement
from .serializers import SettlementSerializer


class SettlementViewSet(viewsets.ModelViewSet):
    serializer_class = SettlementSerializer

    def get_queryset(self):
        return Settlement.objects.filter(
            Q(payer=self.request.user) | Q(receiver=self.request.user)
        ).order_by("-created_at")

    @decorators.action(detail=True, methods=["post"], url_path="mark-paid")
    def mark_paid(self, request, pk=None):
        settlement = self.get_object()
        if settlement.payer != request.user:
            return response.Response(
                {"detail": "Only the payer can mark this settlement as paid."},
                status=status.HTTP_403_FORBIDDEN,
            )
        settlement.status = Settlement.Status.PAID
        settlement.paid_at = timezone.now()
        if "payment_proof" in request.FILES:
            settlement.payment_proof = request.FILES["payment_proof"]
        settlement.save(update_fields=["status", "paid_at", "payment_proof", "updated_at"])
        return response.Response(self.get_serializer(settlement).data)

    @decorators.action(detail=True, methods=["post"], url_path="confirm-received")
    def confirm_received(self, request, pk=None):
        settlement = self.get_object()
        if settlement.receiver != request.user:
            return response.Response(
                {"detail": "Only the receiver can confirm this settlement."},
                status=status.HTTP_403_FORBIDDEN,
            )
        settlement.status = Settlement.Status.CONFIRMED
        settlement.confirmed_at = timezone.now()
        settlement.save(update_fields=["status", "confirmed_at", "updated_at"])
        return response.Response(self.get_serializer(settlement).data)
