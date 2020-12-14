from .views import EditUserProfileView
from django.urls import path

urlpatterns = [
    path("auth/user", EditUserProfileView.as_view(), name='edit_profile')
]