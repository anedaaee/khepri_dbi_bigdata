from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import serializers,status
from controller.authenticationCtrl import Authorization

from .models import Users


class SignupSerializer(serializers.Serializer):
    _id = serializers.CharField(min_length=3,required=True)
    password = serializers.CharField(min_length=3,required=True)
    full_name = serializers.CharField(min_length=3,required=True)
    email = serializers.EmailField()
    phone = serializers.CharField(min_length=10,required=True)
    
class Signup(APIView):
    
    def post(self,request:Request):
        try:
            print("hi")
            serializers = SignupSerializer(data=request.data)
            
            auth = Authorization()
            
            if serializers.is_valid() :
                values = serializers.validated_data
                user = auth.signup(values=values)
                
                response = {
                    "metadata":{
                        "success":True,
                        "message":"succesfully registered"
                    },
                    "body":{
                        "data" : user
                        
                    }
                }
                
                
                return Response(response)
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
                    "message":"error happend please try again later and call us.",
                },
                "body":{
                    "error":e,
                    "type":"error"
                }
            }
            return Response(response,status=status.HTTP_500_INTERNAL_SERVER_ERROR)