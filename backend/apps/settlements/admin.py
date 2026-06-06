from django.contrib import admin

from .models import Settlement


@admin.register(Settlement)
class SettlementAdmin(admin.ModelAdmin):
    list_display = ("group", "payer", "receiver", "amount", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("group__name", "payer__username", "receiver__username")
