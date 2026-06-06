from django.db.models import Q
from rest_framework import decorators, exceptions, permissions, response, status, viewsets

from .models import ExpenseGroup, GroupMember
from .permissions import IsGroupMemberForReadOwnerForWrite
from .serializers import AddGroupMemberSerializer, ExpenseGroupSerializer, GroupMemberSerializer


class ExpenseGroupViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseGroupSerializer
    permission_classes = (permissions.IsAuthenticated, IsGroupMemberForReadOwnerForWrite)

    def get_queryset(self):
        return (
            ExpenseGroup.objects.filter(
                Q(created_by=self.request.user) | Q(member_links__user=self.request.user)
            )
            .distinct()
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        group = serializer.save(created_by=self.request.user)
        GroupMember.objects.get_or_create(
            group=group,
            user=self.request.user,
            defaults={"role": GroupMember.Role.OWNER},
        )

    def get_permissions(self):
        if self.action == "create":
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    @decorators.action(detail=True, methods=["post"], url_path="add-member")
    def add_member(self, request, pk=None):
        group = self.get_object()
        serializer = AddGroupMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        membership, created = GroupMember.objects.get_or_create(
            group=group,
            user_id=serializer.validated_data["user_id"],
            defaults={"role": serializer.validated_data["role"]},
        )
        if not created:
            return response.Response({"detail": "User is already a member of this group."}, status=status.HTTP_400_BAD_REQUEST)
        return response.Response(GroupMemberSerializer(membership).data, status=status.HTTP_201_CREATED)

    @decorators.action(detail=True, methods=["delete"], url_path=r"remove-member/(?P<user_id>[^/.]+)")
    def remove_member(self, request, pk=None, user_id=None):
        group = self.get_object()
        membership = GroupMember.objects.filter(group=group, user_id=user_id).first()
        if not membership:
            return response.Response({"detail": "Member not found in this group."}, status=status.HTTP_404_NOT_FOUND)
        if membership.role == GroupMember.Role.OWNER and group.member_links.filter(role=GroupMember.Role.OWNER).count() == 1:
            return response.Response({"detail": "A group must keep at least one owner."}, status=status.HTTP_400_BAD_REQUEST)
        membership.delete()
        return response.Response(status=status.HTTP_204_NO_CONTENT)


class GroupMemberViewSet(viewsets.ModelViewSet):
    serializer_class = GroupMemberSerializer

    def get_queryset(self):
        return GroupMember.objects.filter(group__member_links__user=self.request.user).distinct()

    def _require_group_owner(self, group):
        if not GroupMember.objects.filter(group=group, user=self.request.user, role=GroupMember.Role.OWNER).exists():
            raise exceptions.PermissionDenied("Only group owners can manage members.")

    def perform_create(self, serializer):
        group = serializer.validated_data["group"]
        self._require_group_owner(group)
        serializer.save()

    def perform_update(self, serializer):
        group = serializer.instance.group
        self._require_group_owner(group)
        serializer.save()

    def perform_destroy(self, instance):
        self._require_group_owner(instance.group)
        instance.delete()
