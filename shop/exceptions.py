from rest_framework.exceptions import APIException


class PayUException(APIException):
    status_code = 400
    default_detail = "Something went wrong while integrating with PayU"
    default_code = "payu_error"
