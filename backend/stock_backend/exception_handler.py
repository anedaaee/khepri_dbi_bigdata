from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed,NotAuthenticated

def auth_exception_handler(exc,context):
    response = exception_handler(exc=exc,context=context)
    if isinstance(exc,NotAuthenticated) or isinstance(exc,AuthenticationFailed):
        response = {
                "metadata":{
                    "success":False,
                    "message":"Authentication Failed",
                },
                "body":{
                    "type":"error"
                }
            }
        return Response(response,status=status.HTTP_401_UNAUTHORIZED)    
    