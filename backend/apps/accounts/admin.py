from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import PaymentProfile, User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("HisabSathi profile", {"fields": ("full_name", "phone_number", "avatar")}),
    )
    list_display = ("username", "email", "full_name", "is_staff", "is_active")
    search_fields = ("username", "email", "full_name", "phone_number")


@admin.register(PaymentProfile)
class PaymentProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "esewa_number", "khalti_number", "bank_name")
    search_fields = ("user__username", "user__email", "esewa_number", "khalti_number")
