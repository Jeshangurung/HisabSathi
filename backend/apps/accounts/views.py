from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, viewsets

from .models import PaymentProfile
from .serializers import PaymentProfileSerializer, RegisterSerializer, UserSerializer


User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)


class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)


class PaymentProfileViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentProfileSerializer

    def get_queryset(self):
        return PaymentProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
