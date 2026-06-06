from django.contrib import admin

from .models import Expense, ExpenseSplit


class ExpenseSplitInline(admin.TabularInline):
    model = ExpenseSplit
    extra = 0


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ("title", "group", "total_amount", "paid_by", "split_type", "category", "expense_date", "created_at")
    list_filter = ("split_type", "category", "expense_date")
    search_fields = ("title", "group__name", "paid_by__username")
    inlines = (ExpenseSplitInline,)


@admin.register(ExpenseSplit)
class ExpenseSplitAdmin(admin.ModelAdmin):
    list_display = ("expense", "user", "amount_owed", "status")
    list_filter = ("status",)
    search_fields = ("expense__title", "user__username")
