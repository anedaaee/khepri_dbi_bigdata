from django.urls import path
from .views import User

urlpatterns = [
    path('user',User.as_view()),
]
