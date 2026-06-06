from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnly(BasePermission):
    """Allows writes only to object owners."""

    owner_field = "user"

    def has_object_permission(self, request, view, obj):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        owner = getattr(obj, self.owner_field, None)
        return owner == request.user


class IsObjectParticipant(BasePermission):
    """Allows access when the user is listed on one of the configured object fields."""

    participant_fields = ()

    def has_object_permission(self, request, view, obj):
        for field_name in getattr(view, "participant_fields", self.participant_fields):
            if getattr(obj, field_name, None) == request.user:
                return True
        return False


class IsOwnerForUnsafeMethods(BasePermission):
    owner_field = "created_by"

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return getattr(obj, self.owner_field, None) == request.user
