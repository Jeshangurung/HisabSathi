from rest_framework import serializers

from apps.common.validators import validate_positive_money
from apps.groups.models import GroupMember

from .models import Settlement


class SettlementSerializer(serializers.ModelSerializer):
    from_user_display = serializers.CharField(source="from_user.get_username", read_only=True)
    to_user_display = serializers.CharField(source="to_user.get_username", read_only=True)

    class Meta:
        model = Settlement
        fields = (
            "id",
            "group",
            "expense",
            "from_user",
            "from_user_display",
            "to_user",
            "to_user_display",
            "amount",
            "status",
            "payment_method",
            "proof_image",
            "transaction_note",
            "marked_paid_at",
            "confirmed_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "status", "marked_paid_at", "confirmed_at", "created_at", "updated_at")

    def validate(self, attrs):
        from_user = attrs.get("from_user")
        to_user = attrs.get("to_user")
        if from_user and to_user and from_user == to_user:
            raise serializers.ValidationError("Settlement users must be different.")
        if "amount" in attrs:
            attrs["amount"] = validate_positive_money(attrs["amount"])
        group = attrs.get("group")
        if group and from_user and not GroupMember.objects.filter(group=group, user=from_user).exists():
            raise serializers.ValidationError({"from_user": "The payer must be a group member."})
        if group and to_user and not GroupMember.objects.filter(group=group, user=to_user).exists():
            raise serializers.ValidationError({"to_user": "The receiver must be a group member."})
        return attrs
