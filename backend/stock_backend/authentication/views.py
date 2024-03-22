from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from rest_framework_simplejwt.views import TokenRefreshView
from controller.authenticationCtrl import Authorization
from .serializers import SignupSerializer,LoginSerializer,RefreshSerializer
from .models import Users



    
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
            print(e)
            response = {
                "metadata":{
                    "success":False,
                    "message":"error happend please try again later and call us.",
                },
                "body":{
                    "type":"error"
                }
            }
            return Response(response,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class Login(APIView):
    permission_classes = [AllowAny]
    
    def post(self,request):
        try:
            serializers = LoginSerializer(data=request.data)
            
            auth = Authorization()
            
            if serializers.is_valid() :
                values = serializers.validated_data
                # auth.login(values=values)
                print("hi")
                user = auth.login(values=values)
                userObj = Users.from_dict(user)
                print(userObj.id)
                refresh = RefreshToken.for_user(userObj)
                access = AccessToken.for_user(userObj)
                response = {
                    "metadata":{
                        "success":True,
                        "message":"succesfully logedin"
                    },
                    "body":{
                        "data" : user,
                        "refreshToken":str(refresh),
                        "accessToken":str(access),
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
                    "message":"error happend please try again later and call us.",
                },
                "body":{
                    "type":"error"
                }
            }
            return Response(response,status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class RefreshTheToken(TokenRefreshView):
    
    serializer_class = RefreshSerializer
    
    def post(self,request,*args,**kwargs):
        try:
            serializer = RefreshSerializer(data=request.data)
            
            if serializer.is_valid():
                old_refresh = serializer.validated_data.get('refresh')
                refresh = RefreshToken(old_refresh)
                access = refresh.access_token
                response = {
                        "metadata":{
                            "success":True,
                            "message":"succesfully refreshed token"
                        },
                        "body":{
                            "refreshToken":str(refresh),
                            "accessToken":str(access),
                            "type":"object"
                        }
                    }
                    
                    
                return Response(response,status=status.HTTP_200_OK)
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
        
                return Response(response,status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            print(str(e))
            response = {
                "metadata":{
                    "success":False,
                    "message":str(e),
                },
                "body":{
                    "type":"error",
                }
            }
            return Response(response,status=status.HTTP_500_INTERNAL_SERVER_ERROR)