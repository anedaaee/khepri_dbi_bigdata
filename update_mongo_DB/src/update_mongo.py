from src.database_khepri_db import KhepriDB
from src.controllers.stock_collection_controller import StockCtrl
from src.controllers.user_collection_controller import UserCtrl
 
class UpdateMongo:
    
    def __init__(self,khepri_db:KhepriDB,users_collection,stock_collection):
        self.khepri_db = khepri_db
        self.users_collection = users_collection
        self.stock_collection = stock_collection
        self.stock_ctr = StockCtrl(stock_collection=stock_collection,khepri_db=khepri_db)
        self.user_ctr = UserCtrl(user_collection=users_collection,khepri_db=khepri_db)
        
    def update(self):
        try:
            self.stock_ctr.update_stock_collection()
            self.user_ctr.update_users_collection()
        except Exception as e:
            raise Exception(f"UpdateMongo update {e} ")
        