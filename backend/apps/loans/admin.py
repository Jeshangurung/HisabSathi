from django.contrib import admin

from .models import Loan


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ("lender", "borrower", "amount", "status", "due_date")
    list_filter = ("status",)
    search_fields = ("lender__username", "borrower__username", "note")
