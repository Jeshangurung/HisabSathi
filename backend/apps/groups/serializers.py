from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import ExpenseGroup, GroupMember


User = get_user_model()


class GroupUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "full_name", "phone_number")


class GroupMemberSerializer(serializers.ModelSerializer):
    user_display = serializers.CharField(source="user.get_username", read_only=True)

    class Meta:
        model = GroupMember
        fields = ("id", "group", "user", "user_display", "role", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")

    def validate(self, attrs):
        group = attrs.get("group") or getattr(self.instance, "group", None)
        user = attrs.get("user") or getattr(self.instance, "user", None)
        if group and user and GroupMember.objects.filter(group=group, user=user).exclude(pk=getattr(self.instance, "pk", None)).exists():
            raise serializers.ValidationError("This user is already a group member.")
        return attrs


class ExpenseGroupSerializer(serializers.ModelSerializer):
    member_count = serializers.IntegerField(source="member_links.count", read_only=True)
    members = GroupMemberSerializer(source="member_links", many=True, read_only=True)

    class Meta:
        model = ExpenseGroup
        fields = ("id", "name", "description", "created_by", "member_count", "members", "created_at", "updated_at")
        read_only_fields = ("id", "created_by", "member_count", "members", "created_at", "updated_at")


class AddGroupMemberSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    role = serializers.ChoiceField(choices=GroupMember.Role.choices, default=GroupMember.Role.MEMBER)

    def validate_user_id(self, value):
        if not User.objects.filter(id=value).exists():
            raise serializers.ValidationError("User does not exist.")
        return value
