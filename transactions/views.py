import csv, uuid
from decimal import Decimal, InvalidOperation
from django.http import HttpResponse
from django.db.models import Sum, Count
from django.utils.dateparse import parse_date
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from cards.models import Card
from .models import Transaction
from .serializers import TransactionSerializer
from drf_spectacular.utils import extend_schema
from .serializers import (
    TransactionSerializer,
    AdminSummarySerializer
)


class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        qs = Transaction.objects.filter(user=self.request.user).select_related("card").order_by("-created_at")
        p = self.request.query_params
        if p.get("status") in ("PENDING","SUCCESS","FAILED"): qs = qs.filter(status=p["status"])
        if p.get("min_amount"):
            try: qs = qs.filter(amount__gte=Decimal(p["min_amount"]))
            except InvalidOperation: return qs.none()
        if p.get("max_amount"):
            try: qs = qs.filter(amount__lte=Decimal(p["max_amount"]))
            except InvalidOperation: return qs.none()
        if p.get("date_from"):
            d = parse_date(p["date_from"])
            if d: qs = qs.filter(created_at__date__gte=d)
        if p.get("date_to"):
            d = parse_date(p["date_to"])
            if d: qs = qs.filter(created_at__date__lte=d)
        return qs

@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_summary(request):
    qs = Transaction.objects.all()
    today = qs.filter(created_at__date=__import__("django.utils.timezone", fromlist=["now"]).now().date())
    return Response({
        "today_count": today.count(),
        "success_count": today.filter(status="SUCCESS").count(),
        "failed_count": today.filter(status="FAILED").count(),
        "pending_count": today.filter(status="PENDING").count(),
        "success_amount": str(today.filter(status="SUCCESS").aggregate(v=Sum("amount"))["v"] or Decimal("0.00")),
    })

@api_view(["GET"])
@permission_classes([IsAdminUser])
def export_csv(request):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="transactions.csv"'
    writer = csv.writer(response)
    writer.writerow(["Payment ID","Username","Amount","Status","Card Last4","Created At"])
    for t in Transaction.objects.select_related("user","card").order_by("-created_at"):
        writer.writerow([t.payment_id,t.user.username,t.amount,t.status,t.card.last4,t.created_at.isoformat()])
    return response
