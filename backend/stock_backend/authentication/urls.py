from django.urls import path
from .views import Signup,Login,RefreshTheToken

urlpatterns = [
    path('signup',Signup.as_view()),
    path('login',Login.as_view()),
    path('refreshToken',RefreshTheToken.as_view()),
]
