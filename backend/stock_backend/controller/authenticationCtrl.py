from utils import users_collection
from authentication.models import Users
from datetime import datetime
import json
import bcrypt 

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
            