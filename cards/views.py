from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Card
from .serializers import CardSerializer

class CardViewSet(viewsets.ModelViewSet):

    queryset = Card.objects.none()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]
    lookup_value_regex = r"\d+"

    http_method_names = [
        "get", "post", "delete", "head", "options"
    ]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Card.objects.none()

        return Card.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)