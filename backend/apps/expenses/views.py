from django.db.models import Q
from rest_framework import viewsets

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


class ExpenseSplitViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSplitSerializer

    def get_queryset(self):
        return ExpenseSplit.objects.filter(
            Q(user=self.request.user) | Q(expense__paid_by=self.request.user)
        ).distinct()
