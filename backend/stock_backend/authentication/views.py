from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from rest_framework_simplejwt.views import TokenRefreshView
from controller.authenticationCtrl import Authorization

from .serializers import SignupSerializer,LoginSerializer,RefreshSerializer
from .models import Users



    
class Signup(APIView):
    
    def post(self,request:Request):
        try:
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
                
                
                return Response(response,status=status.HTTP_201_CREATED)
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
        
        
class Login(APIView):
    
    def post(self,request):
        try:
            serializers = LoginSerializer(data=request.data)
            
            auth = Authorization()
            
            if serializers.is_valid() :
                values = serializers.validated_data
                user,token = auth.login(values=values)
                response = {
                    "metadata":{
                        "success":True,
                        "message":"succesfully logedin"
                    },
                    "body":{
                        "data" : user,
                        "token":token,
                        "type":"object"
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
        
        
class NotAutenticated(APIView):
    
    def get(self,request):
        response = {
            "metadata":{
                "success":False,
                "message":"Authentication Failed"
            },
            "body":{
                "type":"error"
            }
        }
        
        
        return Response(response,status=status.HTTP_401_UNAUTHORIZED)
    
