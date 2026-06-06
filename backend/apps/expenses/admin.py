from django.contrib import admin

from .models import Expense, ExpenseSplit


class ExpenseSplitInline(admin.TabularInline):
    model = ExpenseSplit
    extra = 0


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ("title", "group", "amount", "paid_by", "split_type", "created_at")
    list_filter = ("split_type",)
    search_fields = ("title", "group__name", "paid_by__username")
    inlines = (ExpenseSplitInline,)


@admin.register(ExpenseSplit)
class ExpenseSplitAdmin(admin.ModelAdmin):
    list_display = ("expense", "user", "amount", "is_paid")
    list_filter = ("is_paid",)
    search_fields = ("expense__title", "user__username")
