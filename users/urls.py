from django.urls import path
from .views import ShippingAddressView

urlpatterns = [
    path("auth/user/shipping", ShippingAddressView.as_view(), name='shipping_address')
]