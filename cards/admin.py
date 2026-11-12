from django.contrib import admin
from .models import Card
@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('id','user','brand','last4','expiry_month','expiry_year')
    search_fields = ('user__username','last4')
