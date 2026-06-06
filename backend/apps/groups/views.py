from django.db.models import Q
from rest_framework import viewsets

from .models import ExpenseGroup, GroupMember
from .serializers import ExpenseGroupSerializer, GroupMemberSerializer


class ExpenseGroupViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseGroupSerializer

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


class GroupMemberViewSet(viewsets.ModelViewSet):
    serializer_class = GroupMemberSerializer

    def get_queryset(self):
        return GroupMember.objects.filter(group__member_links__user=self.request.user).distinct()
