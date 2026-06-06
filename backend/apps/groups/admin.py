from django.contrib import admin

from .models import ExpenseGroup, GroupMember


class GroupMemberInline(admin.TabularInline):
    model = GroupMember
    extra = 0


@admin.register(ExpenseGroup)
class ExpenseGroupAdmin(admin.ModelAdmin):
    list_display = ("name", "created_by", "created_at")
    search_fields = ("name", "created_by__username", "created_by__email")
    inlines = (GroupMemberInline,)


@admin.register(GroupMember)
class GroupMemberAdmin(admin.ModelAdmin):
    list_display = ("group", "user", "role", "created_at")
    list_filter = ("role",)
    search_fields = ("group__name", "user__username", "user__email")
