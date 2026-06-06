from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from apps.common.validators import quantize_money, validate_positive_money
from apps.groups.models import GroupMember

from .models import Expense, ExpenseSplit


def split_evenly(amount, participant_count):
    cents = int((quantize_money(amount) * Decimal("100")).quantize(Decimal("1")))
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
        fields = ("id", "expense", "user", "user_display", "amount_owed", "status", "created_at", "updated_at")
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
            "description",
            "total_amount",
            "paid_by",
            "created_by",
            "split_type",
            "expense_date",
            "category",
            "receipt_image",
            "splits",
            "split_participant_ids",
            "custom_splits",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_by", "splits", "created_at", "updated_at")
        extra_kwargs = {
            "expense_date": {"required": False},
        }

    def validate(self, attrs):
        split_type = attrs.get("split_type", Expense.SplitType.EQUAL)
        total_amount = attrs.get("total_amount")
        paid_by = attrs.get("paid_by")
        group = attrs.get("group")

        if total_amount is not None:
            attrs["total_amount"] = validate_positive_money(total_amount, "total_amount")

        if group and paid_by and not GroupMember.objects.filter(group=group, user=paid_by).exists():
            raise serializers.ValidationError({"paid_by": "The payer must be a member of the selected group."})

        if split_type == Expense.SplitType.CUSTOM:
            custom_splits = self.initial_data.get("custom_splits", [])
            if not custom_splits:
                raise serializers.ValidationError({"custom_splits": "Custom split data is required."})

            total = Decimal("0")
            seen_users = set()
            for item in custom_splits:
                user_id = item.get("user")
                if user_id is None or "amount" not in item:
                    raise serializers.ValidationError("Each custom split must include user and amount.")
                if user_id in seen_users:
                    raise serializers.ValidationError("Each custom split user can appear only once.")
                seen_users.add(user_id)
                if paid_by and int(user_id) == paid_by.id:
                    raise serializers.ValidationError("The payer cannot owe themselves.")
                if group and not GroupMember.objects.filter(group=group, user_id=user_id).exists():
                    raise serializers.ValidationError("Every custom split user must be a group member.")
                total += validate_positive_money(item.get("amount"), "amount")

            if quantize_money(total) != total_amount:
                raise serializers.ValidationError("Custom split total must equal expense amount.")
        else:
            participant_ids = self.initial_data.get("split_participant_ids", [])
            if participant_ids and group:
                unique_participants = set(participant_ids)
                member_count = GroupMember.objects.filter(group=group, user_id__in=unique_participants).count()
                if member_count != len(unique_participants):
                    raise serializers.ValidationError("Every split participant must be a group member.")

        return attrs

    def create(self, validated_data):
        participant_ids = validated_data.pop("split_participant_ids", [])
        custom_splits = validated_data.pop("custom_splits", [])
        validated_data.setdefault("expense_date", timezone.localdate())

        with transaction.atomic():
            expense = Expense.objects.create(
                created_by=self.context["request"].user,
                **validated_data,
            )

            split_rows = []
            if expense.split_type == Expense.SplitType.CUSTOM:
                split_rows = [
                    ExpenseSplit(
                        expense=expense,
                        user_id=item["user"],
                        amount_owed=validate_positive_money(item["amount"], "amount"),
                    )
                    for item in custom_splits
                ]
            else:
                if not participant_ids:
                    participant_ids = list(expense.group.member_links.values_list("user_id", flat=True))

                participant_ids = list(dict.fromkeys(participant_ids))
                if not participant_ids:
                    raise serializers.ValidationError("At least one split participant is required.")

                debtor_ids = [user_id for user_id in participant_ids if user_id != expense.paid_by_id]
                if not debtor_ids:
                    raise serializers.ValidationError("At least one participant other than the payer is required.")

                shares = split_evenly(expense.total_amount, len(participant_ids))
                split_rows = [
                    ExpenseSplit(expense=expense, user_id=user_id, amount_owed=share)
                    for user_id, share in zip(participant_ids, shares)
                    if user_id != expense.paid_by_id
                ]

            ExpenseSplit.objects.bulk_create(split_rows)
            self._create_settlements_and_reminders(expense)
        return expense

    def _create_settlements_and_reminders(self, expense):
        from apps.reminders.models import Reminder
        from apps.settlements.models import Settlement

        settlements = [
            Settlement(
                group=expense.group,
                expense=expense,
                from_user=split.user,
                to_user=expense.paid_by,
                amount=split.amount_owed,
            )
            for split in expense.splits.select_related("user")
        ]
        Settlement.objects.bulk_create(settlements)
        Reminder.objects.bulk_create(
            [
                Reminder(
                    user=settlement.from_user,
                    title=f"Payment pending for {expense.title}",
                    message=f"You owe {settlement.amount} to {expense.paid_by.get_username()}.",
                    reminder_type=Reminder.ReminderType.SETTLEMENT,
                    settlement=settlement,
                )
                for settlement in Settlement.objects.filter(expense=expense)
            ]
        )
