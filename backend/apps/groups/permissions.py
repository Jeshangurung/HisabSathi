from rest_framework.permissions import SAFE_METHODS, BasePermission

from .models import GroupMember


class IsGroupMemberForReadOwnerForWrite(BasePermission):
    def has_object_permission(self, request, view, obj):
        is_member = GroupMember.objects.filter(group=obj, user=request.user).exists()
        if request.method in SAFE_METHODS:
            return is_member
        return GroupMember.objects.filter(group=obj, user=request.user, role=GroupMember.Role.OWNER).exists()
