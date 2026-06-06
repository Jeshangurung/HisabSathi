from django.contrib import admin

from .models import Settlement


@admin.register(Settlement)
class SettlementAdmin(admin.ModelAdmin):
    list_display = ("group", "expense", "from_user", "to_user", "amount", "status", "created_at")
    list_filter = ("status", "payment_method")
    search_fields = ("group__name", "expense__title", "from_user__username", "to_user__username")
