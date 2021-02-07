from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (AdminItemViewset, UserItemView, UserItemDetailView, UserOrderView,
                    AdminItemImageView, AdminShippingMethodViewset, UserOrderPaymentView,
                    PayUNotifyView, AdminNotificationView, AdminCategoryViewset, ShippingMethodView)

admin_item_router = DefaultRouter()
admin_item_router.register(r"items", AdminItemViewset, basename="shop-admin")

admin_shipping_method_router = DefaultRouter()
admin_shipping_method_router.register(
    r"shipping-method",
    AdminShippingMethodViewset,
    basename="shipping-admin"
)

admin_category_router = DefaultRouter()
admin_category_router.register(r"category", AdminCategoryViewset, basename="category-admin")

urlpatterns = [
    path("admin/", include(admin_item_router.urls)),
    path("admin/", include(admin_shipping_method_router.urls)),
    path("admin/", include(admin_category_router.urls)),
    path("admin/notifications/", AdminNotificationView.as_view(), name="admin_notification_view"),
    path("methods/", ShippingMethodView.as_view(), name="shipping_method_view"),
    path("payment/<int:order_pk>/", UserOrderPaymentView.as_view(), name="payment_view"),
    path("admin/items/images/<uuid:image_pk>/", AdminItemImageView.as_view(), name="delete_image_view"),
    path("items/<uuid:item_pk>/", UserItemDetailView.as_view(), name="item_details_view"),
    path("items/", UserItemView.as_view(), name="item_view"),
    path("order/", UserOrderView.as_view(), name="order_view"),
    path("notify/", PayUNotifyView.as_view(), name="notify_view")
]
