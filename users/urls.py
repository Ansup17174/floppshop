from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShippingAddressViewset

shipping_router = DefaultRouter()
shipping_router.register(r"shipping", ShippingAddressViewset, basename='shipping')


urlpatterns = [
    path('', include(shipping_router.urls))
]
