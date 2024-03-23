from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from controller.purchaseCtrl import PurchaseCtrl
from .serializers import PurchaseSelializer
# Create your views here.

class Purchase(APIView):    
    def post(self,request:Request):
        try:
            serializer = PurchaseSelializer(data=request.data)
            
            purchaseCtrl = PurchaseCtrl()
            if serializer.is_valid():
                values = serializer.validated_data
                values['user'] = request.user_id
                purchaseCtrl.purchase(values)  
                response = {
                    "metadata":{
                        "success":True,
                        "message":"succesfull,"
                    }
                }    
            
                return Response(response,status=status.HTTP_201_CREATED)
            else:
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
            
                return Response(response,status=status.HTTP_201_CREATED)
        
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
        
        

class Sale(APIView):    
    def post(self,request:Request):
        try:
            serializer = PurchaseSelializer(data=request.data)
            
            purchaseCtrl = PurchaseCtrl()
            if serializer.is_valid():
                values = serializer.validated_data
                values['user'] = request.user_id
                purchaseCtrl.sale(values)  
                response = {
                    "metadata":{
                        "success":True,
                        "message":"succesfull,"
                    }
                }    
            
                return Response(response,status=status.HTTP_201_CREATED)
            else:
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
            
                return Response(response,status=status.HTTP_201_CREATED)
        
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
        