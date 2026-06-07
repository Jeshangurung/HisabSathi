from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import PaymentProfile


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    payment_profile_id = serializers.IntegerField(source="payment_profile.id", read_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "full_name", "phone_number", "avatar", "payment_profile_id")
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
        PaymentProfile.objects.create(user=user, phone_number=user.phone_number)
        return user


class RegisterResponseSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields

    def to_representation(self, instance):
        data = super().to_representation(instance)
        refresh = RefreshToken.for_user(instance)
        data["access"] = str(refresh.access_token)
        data["refresh"] = str(refresh)
        return data


class PaymentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentProfile
        fields = (
            "id",
            "user",
            "phone_number",
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


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        identifier = attrs.get(self.username_field)
        if identifier and "@" in identifier:
            user = User.objects.filter(email__iexact=identifier, is_active=True).order_by("id").first()
            if user:
                attrs[self.username_field] = user.get_username()
        return super().validate(attrs)
