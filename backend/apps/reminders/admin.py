from django.contrib import admin

from .models import Reminder


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "reminder_type", "due_at", "is_read")
    list_filter = ("reminder_type", "is_read")
    search_fields = ("title", "user__username", "body")
