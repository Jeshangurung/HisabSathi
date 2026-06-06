from rest_framework import decorators, response, viewsets

from .models import Reminder
from .serializers import ReminderSerializer


class ReminderViewSet(viewsets.ModelViewSet):
    serializer_class = ReminderSerializer

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user).order_by("is_read", "-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @decorators.action(detail=True, methods=["post"], url_path="mark-read")
    def mark_read(self, request, pk=None):
        reminder = self.get_object()
        reminder.is_read = True
        reminder.save(update_fields=["is_read", "updated_at"])
        return response.Response(self.get_serializer(reminder).data)

    @decorators.action(detail=False, methods=["post"], url_path="mark-all-read")
    def mark_all_read(self, request):
        updated = self.get_queryset().filter(is_read=False).update(is_read=True)
        return response.Response({"updated": updated})
