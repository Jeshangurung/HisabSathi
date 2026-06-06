from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, response, status, viewsets
from rest_framework_simplejwt.tokens import RefreshToken

from .models import PaymentProfile
from .serializers import PaymentProfileSerializer, RegisterResponseSerializer, RegisterSerializer, UserSerializer


User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return response.Response(RegisterResponseSerializer(user, context={"request": request}).data, status=status.HTTP_201_CREATED)


class LogoutView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return response.Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return response.Response({"detail": "Invalid refresh token."}, status=status.HTTP_400_BAD_REQUEST)
        return response.Response(status=status.HTTP_204_NO_CONTENT)


class CurrentUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


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
