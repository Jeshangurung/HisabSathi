from decimal import Decimal

from rest_framework import serializers

from .models import Expense, ExpenseSplit


def split_evenly(amount, participant_count):
    cents = int((amount * Decimal("100")).quantize(Decimal("1")))
    base = cents // participant_count
    remainder = cents % participant_count
    amounts = []
    for index in range(participant_count):
        share = base + (1 if index < remainder else 0)
        amounts.append(Decimal(share) / Decimal("100"))
    return amounts


class ExpenseSplitSerializer(serializers.ModelSerializer):
    user_display = serializers.CharField(source="user.get_username", read_only=True)

    class Meta:
        model = ExpenseSplit
        fields = ("id", "expense", "user", "user_display", "amount", "is_paid", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class ExpenseSerializer(serializers.ModelSerializer):
    splits = ExpenseSplitSerializer(many=True, read_only=True)
    split_participant_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
    )
    custom_splits = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = Expense
        fields = (
            "id",
            "group",
            "title",
            "notes",
            "amount",
            "paid_by",
            "created_by",
            "split_type",
            "receipt_image",
            "splits",
            "split_participant_ids",
            "custom_splits",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_by", "splits", "created_at", "updated_at")

    def validate(self, attrs):
        split_type = attrs.get("split_type", Expense.SplitType.EQUAL)
        amount = attrs.get("amount")
        paid_by = attrs.get("paid_by")

        if split_type == Expense.SplitType.CUSTOM:
            custom_splits = self.initial_data.get("custom_splits", [])
            if not custom_splits:
                raise serializers.ValidationError({"custom_splits": "Custom split data is required."})

            total = Decimal("0")
            for item in custom_splits:
                user_id = item.get("user")
                if user_id is None or "amount" not in item:
                    raise serializers.ValidationError("Each custom split must include user and amount.")
                if paid_by and int(user_id) == paid_by.id:
                    raise serializers.ValidationError("The payer cannot owe themselves.")
                total += Decimal(str(item.get("amount", "0")))

            if total != amount:
                raise serializers.ValidationError("Custom split total must equal expense amount.")

        return attrs

    def create(self, validated_data):
        participant_ids = validated_data.pop("split_participant_ids", [])
        custom_splits = validated_data.pop("custom_splits", [])
        expense = Expense.objects.create(
            created_by=self.context["request"].user,
            **validated_data,
        )

        if expense.split_type == Expense.SplitType.CUSTOM:
            ExpenseSplit.objects.bulk_create(
                [
                    ExpenseSplit(
                        expense=expense,
                        user_id=item["user"],
                        amount=Decimal(str(item["amount"])),
                    )
                    for item in custom_splits
                ]
            )
            return expense

        if not participant_ids:
            participant_ids = list(expense.group.member_links.values_list("user_id", flat=True))

        participant_ids = list(dict.fromkeys(participant_ids))
        if not participant_ids:
            raise serializers.ValidationError("At least one split participant is required.")

        debtor_ids = [user_id for user_id in participant_ids if user_id != expense.paid_by_id]
        if not debtor_ids:
            raise serializers.ValidationError("At least one participant other than the payer is required.")

        shares = split_evenly(expense.amount, len(participant_ids))
        ExpenseSplit.objects.bulk_create(
            [
                ExpenseSplit(expense=expense, user_id=user_id, amount=share)
                for user_id, share in zip(participant_ids, shares)
                if user_id != expense.paid_by_id
            ]
        )
        return expense
