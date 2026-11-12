from django.conf import settings
from django.db import models

class Card(models.Model):
    BRAND_CHOICES = [("VISA", "Visa"), ("MASTERCARD", "Mastercard"), ("OTHER", "Other")]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cards")
    brand = models.CharField(max_length=20, choices=BRAND_CHOICES, default="OTHER")
    last4 = models.CharField(max_length=4)
    expiry_month = models.PositiveSmallIntegerField()
    expiry_year = models.PositiveSmallIntegerField()
    provider_token = models.CharField(max_length=120, blank=True)  # fake token for this demo only
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def masked_card(self):
        return f"**** **** **** {self.last4}"
    def __str__(self):
        return f"{self.brand} ****{self.last4}"
