from utils import users_collection

class UserCtrl:
    
    def getUser(self,user_id):
        try:
            
            pipeline = [
                {'$match':{'_id':user_id}},
                {'$project':{
                    'password':0,
                }}
            ]
            users = users_collection.aggregate(pipeline=pipeline)
            
            if users:
                users = list(users)
                for user in users:
                    id = str(user['_id'])
                    user['_id']=id
                if len(users) == 1:
                   return users[0]
                else:
                    raise Exception("invalid user")
            else:
                raise Exception("invalid user")
        except Exception as e:
            print(e)
            raise Exception(str(e))
        
    def deleteUser(self,user_id):
        try:      
            users_collection.update_one({'_id':user_id},{'$set':{'is_active':False}})
        except Exception as e:
            print(e)
            raise Exception(str(e))


