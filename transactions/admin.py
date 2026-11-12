from django.contrib import admin
from .models import Transaction
@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('payment_id','user','amount','status','card','created_at')
    list_filter = ('status','created_at')
    search_fields = ('payment_id','user__username')
