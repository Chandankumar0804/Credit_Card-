from django.conf import settings
from django.db import models
from cards.models import Card

class Transaction(models.Model):
    STATUS = [("PENDING", "Pending"), ("SUCCESS", "Success"), ("FAILED", "Failed")]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="transactions")
    card = models.ForeignKey(Card, on_delete=models.PROTECT, related_name="transactions")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS, default="PENDING")
    payment_id = models.CharField(max_length=40, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.payment_id} - {self.status}"
