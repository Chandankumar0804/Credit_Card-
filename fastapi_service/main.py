import os, sys, uuid, random
from pathlib import Path
from decimal import Decimal
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Header
from pydantic import BaseModel, Field
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
load_dotenv(ROOT / ".env")
import django
django.setup()
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from django.db import transaction as db_transaction
from cards.models import Card
from transactions.models import Transaction

app = FastAPI(title="Credit Card Payment API", version="1.0.0",
              description="Educational payment simulator. No real card processing.")

class PaymentRequest(BaseModel):
    card_id: int
    amount: Decimal = Field(gt=Decimal("0"), max_digits=12, decimal_places=2)
    simulate_failure: bool = False

def current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "Bearer token required")
    try:
        token = AccessToken(authorization.split(" ", 1)[1])
        user = get_user_model().objects.get(id=token["user_id"], is_active=True)
        return user
    except Exception:
        raise HTTPException(401, "Invalid or expired access token")

@app.get("/health")
def health():
    return {"status": "ok", "service": "payment-simulator"}

@app.post("/api/payments/", status_code=201)
def make_payment(payload: PaymentRequest, user=Depends(current_user)):
    try:
        card = Card.objects.get(id=payload.card_id, user=user)
    except Card.DoesNotExist:
        raise HTTPException(404, "Card not found for this user")
    payment_id = "pay_" + uuid.uuid4().hex[:20]
    with db_transaction.atomic():
        record = Transaction.objects.create(
            user=user, card=card, amount=payload.amount, status="PENDING", payment_id=payment_id
        )
        # Deterministic demo switch; never trust a client-controlled success result in real payments.
        record.status = "FAILED" if payload.simulate_failure else "SUCCESS"
        record.save(update_fields=["status", "updated_at"])
    return {"payment_id": record.payment_id, "amount": str(record.amount), "status": record.status}

@app.get("/api/payments/{payment_id}/")
def payment_status(payment_id: str, user=Depends(current_user)):
    try:
        p = Transaction.objects.get(payment_id=payment_id, user=user)
    except Transaction.DoesNotExist:
        raise HTTPException(404, "Payment not found")
    return {"payment_id": p.payment_id, "amount": str(p.amount), "status": p.status}
