from rest_framework import serializers

from apps.common.validators import validate_positive_money

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
            "reason",
            "due_date",
            "proof_image",
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
        if "amount" in attrs:
            attrs["amount"] = validate_positive_money(attrs["amount"])
        return attrs
