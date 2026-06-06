from rest_framework import serializers

from .models import Settlement


class SettlementSerializer(serializers.ModelSerializer):
    payer_display = serializers.CharField(source="payer.get_username", read_only=True)
    receiver_display = serializers.CharField(source="receiver.get_username", read_only=True)

    class Meta:
        model = Settlement
        fields = (
            "id",
            "group",
            "payer",
            "payer_display",
            "receiver",
            "receiver_display",
            "amount",
            "status",
            "payment_proof",
            "paid_at",
            "confirmed_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "status", "paid_at", "confirmed_at", "created_at", "updated_at")

    def validate(self, attrs):
        payer = attrs.get("payer")
        receiver = attrs.get("receiver")
        if payer and receiver and payer == receiver:
            raise serializers.ValidationError("Payer and receiver must be different users.")
        return attrs
