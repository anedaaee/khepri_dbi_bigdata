from django.urls import path
from .views import Signup,Login,NotAutenticated#,RefreshTheToken

urlpatterns = [
    path('signup',Signup.as_view()),
    path('login',Login.as_view()),
    path('notAutenticated',NotAutenticated.as_view()),
    # path('refreshToken',RefreshTheToken.as_view()),
]
