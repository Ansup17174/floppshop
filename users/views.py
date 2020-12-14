from rest_framework.generics import UpdateAPIView
from django.contrib.auth import get_user_model
from .serializers import EditProfileSerializer

# Create your views here.
User = get_user_model()


class EditUserProfileView(UpdateAPIView):

    serializer_class = EditProfileSerializer

    def get_queryset(self):
        return self.request.user
