from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import NotFound
from .serializers import ShippingAddressSerializer
from .models import ShippingAddress


class ShippingAddressViewset(ModelViewSet):

    serializer_class = ShippingAddressSerializer

    def get_queryset(self):
        try:
            return ShippingAddress.objects.get(user=self.request.user)
        except ShippingAddress.DoesNotExist:
            raise NotFound("No shipping address set")


# TODO handle shipping address creation
