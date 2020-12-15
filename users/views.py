from rest_framework.generics import RetrieveUpdateAPIView
from .serializers import ShippingAddressSerializer
from .models import ShippingAddress


class ShippingAddressView(RetrieveUpdateAPIView):
    queryset = ShippingAddress.objects.filter()