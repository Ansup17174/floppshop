from rest_framework.exceptions import APIException
from django.shortcuts import Http404
from rest_framework.views import exception_handler


class PayUException(APIException):
    status_code = 400
    default_detail = "Something went wrong while integrating with PayU"
    default_code = "payu_error"


def custom_exception_handler(exception, context):
    response = exception_handler(exception, context)

    if response is not None and isinstance(exception, Http404):
        try:
            response.data['detail'] = exception.args[0]
        except IndexError:
            pass
    return response
