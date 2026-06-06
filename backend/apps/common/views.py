from decimal import Decimal

from django.db.models import Q, Sum
from rest_framework import permissions
from rest_framework.views import APIView

from apps.expenses.models import Expense
from apps.groups.models import ExpenseGroup
from apps.loans.models import Loan
from apps.reminders.models import Reminder
from apps.settlements.models import Settlement

from .responses import api_response


def money_sum(queryset):
    return queryset.aggregate(total=Sum("amount"))["total"] or Decimal("0.00")


def compact_group(group):
    return {
        "id": group.id,
        "name": group.name,
        "member_count": group.member_links.count(),
        "created_at": group.created_at,
    }


def compact_expense(expense):
    return {
        "id": expense.id,
        "group": expense.group_id,
        "title": expense.title,
        "total_amount": expense.total_amount,
        "paid_by": expense.paid_by_id,
        "split_type": expense.split_type,
        "expense_date": expense.expense_date,
    }


def compact_settlement(settlement):
    return {
        "id": settlement.id,
        "group": settlement.group_id,
        "expense": settlement.expense_id,
        "from_user": settlement.from_user_id,
        "to_user": settlement.to_user_id,
        "amount": settlement.amount,
        "status": settlement.status,
    }


def compact_reminder(reminder):
    return {
        "id": reminder.id,
        "title": reminder.title,
        "message": reminder.message,
        "reminder_type": reminder.reminder_type,
        "is_read": reminder.is_read,
        "created_at": reminder.created_at,
    }


class DashboardSummaryView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        active_settlement_statuses = [Settlement.Status.PENDING, Settlement.Status.MARKED_PAID]
        active_loan_statuses = [Loan.Status.ACTIVE, Loan.Status.MARKED_PAID]

        groups = ExpenseGroup.objects.filter(
            Q(created_by=request.user) | Q(member_links__user=request.user)
        ).distinct()
        expenses = Expense.objects.filter(
            Q(created_by=request.user) | Q(paid_by=request.user) | Q(group__member_links__user=request.user)
        ).distinct()
        settlements = Settlement.objects.filter(Q(from_user=request.user) | Q(to_user=request.user))
        reminders = Reminder.objects.filter(user=request.user)

        summary = {
            "total_amount_i_owe": money_sum(
                settlements.filter(from_user=request.user, status__in=active_settlement_statuses)
            ),
            "total_amount_i_am_owed": money_sum(
                settlements.filter(to_user=request.user, status__in=active_settlement_statuses)
            ),
            "pending_settlement_count": settlements.filter(status__in=active_settlement_statuses).count(),
            "active_loans_borrowed_count": Loan.objects.filter(
                borrower=request.user,
                status__in=active_loan_statuses,
            ).count(),
            "active_loans_given_count": Loan.objects.filter(
                lender=request.user,
                status__in=active_loan_statuses,
            ).count(),
            "recent_groups": [compact_group(group) for group in groups.order_by("-created_at")[:5]],
            "recent_expenses": [compact_expense(expense) for expense in expenses.order_by("-created_at")[:5]],
            "recent_settlements": [
                compact_settlement(settlement)
                for settlement in settlements.order_by("-created_at")[:5]
            ],
            "recent_reminders": [
                compact_reminder(reminder)
                for reminder in reminders.order_by("is_read", "-created_at")[:5]
            ],
        }
        return api_response(summary)
