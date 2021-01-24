from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from .serializers import ShippingAddressSerializer
from .models import ShippingAddress
from .exceptions import ShippingAlreadyCreatedException


class ShippingAddressView(APIView):

    def get(self, request):
        try:
            address = ShippingAddress.objects.get(user=self.request.user)
            serializer = ShippingAddressSerializer(address)
            return Response(serializer.data, status=200)
        except ShippingAddress.DoesNotExist:
            raise NotFound("No shipping address set")

    def post(self, request):
        if ShippingAddress.objects.filter(user=self.request.user).exists():
            raise ShippingAlreadyCreatedException()
        serializer = ShippingAddressSerializer(data=self.request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=201)

    def patch(self, request):
        try:
            address = ShippingAddress.objects.get(user=self.request.user)
            serializer = ShippingAddressSerializer(address, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=200)
        except ShippingAddress.DoesNotExist:
            raise NotFound("No shipping address set")

    def delete(self, request):
        try:
            address = ShippingAddress.objects.get(user=self.request.user)
            address.delete()
            return Response(status=204)
        except ShippingAddress.DoesNotExist:
            raise NotFound("No shipping address set")


