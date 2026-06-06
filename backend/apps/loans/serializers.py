from rest_framework import serializers

from .models import Loan


class LoanSerializer(serializers.ModelSerializer):
    lender_display = serializers.CharField(source="lender.get_username", read_only=True)
    borrower_display = serializers.CharField(source="borrower.get_username", read_only=True)

    class Meta:
        model = Loan
        fields = (
            "id",
            "lender",
            "lender_display",
            "borrower",
            "borrower_display",
            "amount",
            "note",
            "due_date",
            "status",
            "paid_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "status", "paid_at", "created_at", "updated_at")

    def validate(self, attrs):
        lender = attrs.get("lender")
        borrower = attrs.get("borrower")
        if lender and borrower and lender == borrower:
            raise serializers.ValidationError("Lender and borrower must be different users.")
        return attrs
