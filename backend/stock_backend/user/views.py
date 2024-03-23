from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from controller.userCtrl import UserCtrl

# Create your views here.

class User(APIView):    
    def get(self,request:Request):
        try:
            userCtrl = UserCtrl()
            user = userCtrl.getUser(request.user_id)  
            response = {
                "metadata":{
                    "success":True,
                    "message":"succesfull,"
                },
                "data":{
                    "type":"object",
                    "user":user
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
        
    def delete(self,request:Request):
        try:
            userCtrl = UserCtrl()
            userCtrl.deleteUser(request.user_id)  
            response = {
                "metadata":{
                    "success":True,
                    "message":"succesfull,"
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