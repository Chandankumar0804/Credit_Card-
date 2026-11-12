from rest_framework import serializers
from .models import Card

class CardSerializer(serializers.ModelSerializer):
    masked_card = serializers.CharField(read_only=True)
    class Meta:
        model = Card
        fields = ("id", "brand", "last4", "masked_card", "expiry_month", "expiry_year", "created_at")
        read_only_fields = ("id", "created_at")
    def validate_last4(self, value):
        if not value.isdigit() or len(value) != 4:
            raise serializers.ValidationError("last4 must contain exactly four digits.")
        return value
    def validate_expiry_month(self, value):
        if not 1 <= value <= 12:
            raise serializers.ValidationError("Expiry month must be between 1 and 12.")
        return value
