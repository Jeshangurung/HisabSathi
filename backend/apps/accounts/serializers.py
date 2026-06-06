from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import PaymentProfile


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "full_name", "phone_number", "avatar")
        read_only_fields = ("id",)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "username", "email", "full_name", "phone_number", "password")
        read_only_fields = ("id",)

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        PaymentProfile.objects.create(user=user)
        return user


class PaymentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentProfile
        fields = (
            "id",
            "user",
            "esewa_number",
            "khalti_number",
            "bank_name",
            "bank_account_name",
            "bank_account_number",
            "payment_qr",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "user", "created_at", "updated_at")
