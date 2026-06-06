from rest_framework.permissions import BasePermission


class IsOwnerOrReadOnly(BasePermission):
    """Allows writes only to object owners."""

    owner_field = "user"

    def has_object_permission(self, request, view, obj):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        owner = getattr(obj, self.owner_field, None)
        return owner == request.user
