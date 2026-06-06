from rest_framework import serializers

from .models import ExpenseGroup, GroupMember


class GroupMemberSerializer(serializers.ModelSerializer):
    user_display = serializers.CharField(source="user.get_username", read_only=True)

    class Meta:
        model = GroupMember
        fields = ("id", "group", "user", "user_display", "role", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class ExpenseGroupSerializer(serializers.ModelSerializer):
    member_count = serializers.IntegerField(source="member_links.count", read_only=True)

    class Meta:
        model = ExpenseGroup
        fields = ("id", "name", "description", "created_by", "member_count", "created_at", "updated_at")
        read_only_fields = ("id", "created_by", "member_count", "created_at", "updated_at")
