from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (AdminItemViewset, UserItemView, UserItemDetailView, UserOrderView,
                    AdminDeleteItemImageView, AdminShippingMethodViewset, UserOrderPaymentView)

admin_item_router = DefaultRouter()
admin_item_router.register(r"items", AdminItemViewset, basename="shop-admin")

admin_shipping_method_router = DefaultRouter()
admin_shipping_method_router.register(r"shipping-method", AdminShippingMethodViewset, basename="shipping-admin")

urlpatterns = [
    path("admin/", include(admin_item_router.urls)),
    path("admin/", include(admin_shipping_method_router.urls)),
    path("payment/<int:order_pk>/", UserOrderPaymentView.as_view(), name="payment_view"),
    path("admin/items/images/<int:image_pk>/", AdminDeleteItemImageView.as_view(), name="delete_image_view"),
    path("items/<int:item_pk>/", UserItemDetailView.as_view(), name="item_detail_view"),
    path("items/", UserItemView.as_view(), name="item_view"),
    path("order/", UserOrderView.as_view(), name="order_view"),
]
