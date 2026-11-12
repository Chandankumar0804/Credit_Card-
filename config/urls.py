
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

from accounts.views import RegisterView, LogoutView, ProfileView
from cards.views import CardViewSet
from transactions.views import (
    TransactionViewSet,
    admin_summary,
    export_csv,
)


# API Router
router = DefaultRouter()
router.register("cards", CardViewSet, basename="cards")
router.register("transactions", TransactionViewSet, basename="transactions")


# Home API
def home(request):
    return JsonResponse({
        "message": "Credit Card Payment System API",
        "status": "running",
        "django_docs": "/api/docs/",
        "admin": "/admin/",
        "fastapi_docs": "http://127.0.0.1:8001/docs",
    })


# URL Patterns
urlpatterns = [
    # Home
    path("", home, name="home"),

    # Django Admin
    path("admin/", admin.site.urls),

    # Authentication
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/login/", TokenObtainPairView.as_view(), name="login"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/logout/", LogoutView.as_view(), name="logout"),
    path("api/profile/", ProfileView.as_view(), name="profile"),

    # Admin APIs
    path("api/admin/summary/", admin_summary, name="admin_summary"),
    path(
        "api/admin/transactions/export/",
        export_csv,
        name="export_csv",
    ),

    # Cards and Transactions
    path("api/", include(router.urls)),

    # API Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),

    path(
    "docs/",
    SpectacularSwaggerView.as_view(url_name="schema"),
    name="swagger-docs",
    ),
]
