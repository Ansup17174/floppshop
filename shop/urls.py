from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminItemViewset

admin_item_router = DefaultRouter()
admin_item_router.register(r"admin", AdminItemViewset, basename="shop-admin")

urlpatterns = [
    path("items/", include(admin_item_router.urls))
]