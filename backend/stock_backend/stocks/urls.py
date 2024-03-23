from django.urls import path
from .views import Stock,Stocks

urlpatterns = [
    path('getStockById',Stock.as_view()),
    path('getStocks',Stocks.as_view()),
]
