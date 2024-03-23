from utils import users_collection
from authentication.models import Users
from datetime import datetime
import bcrypt 
import jwt
import time
from stock_backend.config import SECRET

class Authorization:
    
    def signup(self,values):
        try:
            password = str(values['password'])
            
            bytes =password.encode('utf-8')
            salt = bcrypt.gensalt()
            hash = bcrypt.hashpw(bytes,salt=salt)
            values['password'] = hash
            values['create_at'] = datetime.now()
            values['purchases'] = []
            values['wallet'] = []
            
            result = users_collection.insert_one(values)
            inserted_id = str(result.inserted_id)
            return inserted_id
            
        except Exception as e:
            print(e)
            if(e.code == 11000):
                raise Exception(f"error happend, this username already registered")
            else:
                
                raise Exception(f"error happend")
    
    def login(self,values):
        try:
            
            
            user = users_collection.aggregate([{"$match":{"_id":values["_id"]}}])
            
            if user:
                users = list(user)
                for user in users:
                    id = str(user['_id'])
                    user['_id']=id
                
                user = users[0]
                password = str(values['password'])
                bytes = password.encode('utf-8')
                result = bcrypt.checkpw(bytes,user['password'])
                if result:
                    ts = int(time.time())
                    access_token_content = {
                        "username": user['_id'],
                        "issual_time": ts,
                        "expire_time" : ts+ (7 * 24 * 60 * 60)
                    }
                    token = jwt.encode(access_token_content,SECRET,algorithm="HS512")
                    return user,token
                else:
                    raise Exception(f"invalid username of password")     
            else:
                raise Exception(f"invalid username of password")
            
            
            
        except Exception as e:
            raise Exception(f"error happend{e}")
            