from django.urls import path, include
from dj_rest_auth.registration.views import VerifyEmailView

urlpatterns = [
    path("", include("dj_rest_auth.urls")),
    path("registration/account-confirm-email/", VerifyEmailView.as_view(), name="account_email_verification_sent"),
    path("registration/", include("dj_rest_auth.registration.urls")),
]
