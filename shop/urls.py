from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminItemViewset, UserItemView, UserItemDetailView, UserOrderView

admin_item_router = DefaultRouter()
admin_item_router.register(r"items", AdminItemViewset, basename="shop-admin")

urlpatterns = [
    path("admin/", include(admin_item_router.urls)),
    path("items/", UserItemView.as_view(), name="item_view"),
    path("items/<int:item_pk>/", UserItemDetailView.as_view(), name="item_detail_view"),
    path("order/", UserOrderView.as_view(), name="order_view")
]