from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    card_last4 = serializers.CharField(
        source="card.last4",
        read_only=True
    )

    class Meta:
        model = Transaction
        fields = (
            "id",
            "payment_id",
            "amount",
            "status",
            "card_last4",
            "created_at"
        )


class AdminSummarySerializer(serializers.Serializer):
    today_count = serializers.IntegerField()
    success_count = serializers.IntegerField()
    failed_count = serializers.IntegerField()
    pending_count = serializers.IntegerField()
    success_amount = serializers.CharField()