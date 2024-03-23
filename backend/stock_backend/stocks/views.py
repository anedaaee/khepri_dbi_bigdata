from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from controller.stockCtrl import StockCtrl
from .serializer import StockSerializer
# Create your views here.

class Stocks(APIView):    
    def get(self,request:Request):
        try:
            stockCtrl = StockCtrl()
            stocks = stockCtrl.getStocks()  
            response = {
                "metadata":{
                    "success":True,
                    "message":"succesfull,"
                },
                "data":{
                    "type":"array",
                    "stock":stocks
                }
            }    
        
            return Response(response,status=status.HTTP_200_OK)
    
        
        except Exception as e:
            print(e)
            response = {
                "metadata":{
                    "success":False,
                    "message":str(e),
                },
                "body":{
                    "type":"error"
                }
            }
            return Response(response,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class Stock(APIView):    
    def get(self,request:Request):
        try:
            
            serializer = StockSerializer(data=request.data)
            stockCtrl = StockCtrl()
            if serializer.is_valid():
                values = serializer.validated_data
                stock,history = stockCtrl.getStock(values=values)  
                response = {
                    "metadata":{
                        "success":True,
                        "message":"succesfull,"
                    },
                    "data":{
                        "type":"object",
                        "stock":stock,
                        "history":history
                    }
                }    
            
                return Response(response,status=status.HTTP_200_OK)
    
            else :
   
                response = {
                    "metadata":{
                        "success":False,
                        "message":"input validation failed."
                    },
                    "body":{
                        "error":"validation error",
                        "type":"error"
                    }
                }
    
                return Response(response,status=status.HTTP_400_BAD_REQUEST) 
            
        except Exception as e:
            print(e)
            response = {
                "metadata":{
                    "success":False,
                    "message":str(e),
                },
                "body":{
                    "type":"error"
                }
            }
            return Response(response,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
