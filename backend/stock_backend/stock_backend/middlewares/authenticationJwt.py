from django.contrib.auth.models import User
from rest_framework.request import Request
from django.shortcuts import redirect
from stock_backend.config import SECRET
import jwt
import time

class AuthenticationJwt:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request:Request):
        
        path = str(request.path_info)
        if(path.startswith('/auth')):
            return self.get_response(request)
        else:
            token = str(request.META.get('HTTP_AUTHORIZATION'))
            if token:
                token = token[len('Bearer '):]
                if token:
                    payload = jwt.decode(jwt=token,key=SECRET,algorithms=["HS512"])

                    request.user_id= payload.get('username')
                    exp = payload.get('expire_time')
                    if int(time.time() > exp):        
                        return redirect('/auth/notAutenticated')
                    else:
                        response = self.get_response(request)
                        return response
                else:
                    return redirect('/auth/notAutenticated')
            else:
                return redirect('/auth/notAutenticated')
        