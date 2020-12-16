from django.urls import path, include
from .views import ShippingAddressView


urlpatterns = [
    path('shipping/', ShippingAddressView.as_view(), name='shipping')
]
