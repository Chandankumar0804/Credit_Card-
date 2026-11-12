from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema

from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    LogoutSerializer,
    LogoutResponseSerializer,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(APIView):

    @extend_schema(responses=ProfileSerializer)
    def get(self, request):
        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
        })


class LogoutView(APIView):

    @extend_schema(
        request=LogoutSerializer,
        responses={
            205: LogoutResponseSerializer,
            400: LogoutResponseSerializer,
        },
    )
    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            token = RefreshToken(
                serializer.validated_data["refresh"]
            )
            token.blacklist()

            return Response(
                {"detail": "Logged out."},
                status=status.HTTP_205_RESET_CONTENT
            )

        except Exception:
            return Response(
                {"detail": "Invalid refresh token."},
                status=status.HTTP_400_BAD_REQUEST
            )