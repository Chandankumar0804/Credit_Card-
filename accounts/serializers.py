
from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):

    card_holder_name = serializers.CharField(
        write_only=True,
        max_length=100
    )

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "card_holder_name",
            "password",
        ]

    def create(self, validated_data):
        card_holder_name = validated_data.pop("card_holder_name")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=card_holder_name
        )

        return user


class ProfileSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField()
    card_holder_name = serializers.CharField(
        source="first_name",
        read_only=True
    )


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class LogoutResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()
