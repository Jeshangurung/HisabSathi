from decimal import Decimal, ROUND_HALF_UP

from rest_framework import serializers


MONEY_QUANT = Decimal("0.01")


def quantize_money(value):
    return Decimal(value).quantize(MONEY_QUANT, rounding=ROUND_HALF_UP)


def validate_positive_money(value, field_name="amount"):
    amount = quantize_money(value)
    if amount <= Decimal("0.00"):
        raise serializers.ValidationError({field_name: "Amount must be greater than zero."})
    return amount
