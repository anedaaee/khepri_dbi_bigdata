from django.urls import path
from .views import Purchase,Sale

urlpatterns = [
    path('purchase',Purchase.as_view()),
    path('sale',Sale.as_view()),
]
