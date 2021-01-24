from rest_framework.exceptions import APIException


class ShippingAlreadyCreatedException(APIException):
    status_code = 400
    default_detail = "Shipping address already created"
    default_code = "already_created"
