from src.database_khepri_db import KhepriDB

class UserCtrl:
    def __init__(self,user_collection,khepri_db:KhepriDB):
        self.user_collection = user_collection
        self.khepri_db = khepri_db
        
    def get_users(self):
        try:
            user_datas = self.user_collection.aggregate([{"$project":{"_id":1,"wallet":1}}])
            if user_datas : 
                user_datas = list(user_datas)
                for user_data in user_datas:
                    id = str(user_data['_id'])
                    user_data['_id'] = id
                return user_datas
            else:
                raise Exception(f"db error ") 
        except Exception as e:
            raise Exception(f"get_users {e} ") 
    
    def get_last_stock_data(self,stock_id):
        try:
            
            query = """SELECT *
                FROM khepri_db.PriceHistory
                WHERE name = %s
                ORDER BY `Date` DESC 
                LIMIT 1;"""
                
            last_stock_data = self.khepri_db.select_request(query=query,data=[stock_id])
            
            return last_stock_data[0]
        
        except Exception as e:
            raise Exception(f" get_last_stock_data {e} ")
    
    def update_user_in_db(self,user_data):
        try:
            new_wallet = []
            for wallet_data in user_data['wallet']:
                last_stock_data = self.get_last_stock_data(wallet_data['_id'])
                new_wallet.append({
                    "_id":wallet_data['_id'],
                    "date":last_stock_data['Date'],
                    "open":last_stock_data['Open'],
                    "close":last_stock_data['Close'],
                    "high":last_stock_data['High'],
                    "low":last_stock_data['Low'],
                    "volume":last_stock_data['Volume'],
                    "name":wallet_data['name'],
                    "number":wallet_data['number']
                })
                self.user_collection.find_one_and_update(
                    {"_id":user_data["_id"]},
                    {"$set":{"wallet":new_wallet}}
                )
        except Exception as e:
            raise Exception(f"update_user_in_db {e} ")
    
    
    
    def update_users_collection(self):
        try:
            user_datas = self.get_users()
            index = 1
            max = len(user_datas)
            for user_data in user_datas:
                self.update_user_in_db(user_data=user_data)
                print(f"updating users collection {index} / {max}")
                index += 1
        except Exception as e:
            raise Exception(f"UsersCtrl update_users_collection {e} ")