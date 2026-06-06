from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import ExpenseGroup, GroupMember


User = get_user_model()


class GroupApiTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username="owner", password="strong-password")
        self.member = User.objects.create_user(username="member", password="strong-password")
        self.client.force_authenticate(user=self.owner)

    def test_create_group_adds_owner_membership(self):
        response = self.client.post("/api/groups/", {"name": "Pokhara Trip"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        group = ExpenseGroup.objects.get(name="Pokhara Trip")
        self.assertTrue(GroupMember.objects.filter(group=group, user=self.owner, role=GroupMember.Role.OWNER).exists())

    def test_owner_can_add_member(self):
        group = ExpenseGroup.objects.create(name="Roommates", created_by=self.owner)
        GroupMember.objects.create(group=group, user=self.owner, role=GroupMember.Role.OWNER)

        response = self.client.post(
            f"/api/groups/{group.id}/add-member/",
            {"user_id": self.member.id, "role": GroupMember.Role.MEMBER},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(GroupMember.objects.filter(group=group, user=self.member).exists())
