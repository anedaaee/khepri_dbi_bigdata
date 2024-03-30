from src.database_khepri_db import KhepriDB

class StockCtrl:
    def __init__(self,stock_collection,khepri_db:KhepriDB):
        self.stock_collection = stock_collection
        self.khepri_db = khepri_db
        
    def get_last_date(self):
        try:
            stock_datas = self.stock_collection.aggregate([{"$project":{"_id":1,"date":1}}])
            if stock_datas : 
                stock_datas = list(stock_datas)
                for stock_data in stock_datas:
                    id = str(stock_data['_id'])
                    stock_data['_id'] = id
                return stock_datas
            else:
                raise Exception(f"db error ") 
        except Exception as e:
            raise Exception(f"get_last_date {e} ") 
    
    def get_new_stock_data(self,stock_data):
        try:
            query = """SELECT *
                FROM khepri_db.PriceHistory
                WHERE name = %s
                AND `Date` > %s;"""
                
            
            new_stock_data = self.khepri_db.select_request(query=query,data=[stock_data['_id'],str(stock_data['date'])])
            
            
            query = """SELECT *
                FROM khepri_db.PriceHistory
                WHERE name = %s
                ORDER BY `Date` DESC 
                LIMIT 1;"""
                
            last_stock_data = self.khepri_db.select_request(query=query,data=[stock_data['_id']])
            
            return new_stock_data,last_stock_data[0]
        
        except Exception as e:
            raise Exception(f" get_new_stock_data {e} ")
    
    def update_stock_in_db(self,stock_data,new_stock_data,last_stock_data):
        try:
            self.stock_collection.find_one_and_update(
                {"_id":stock_data['_id']},
                {
                    "$push":{"history" : {"$each":new_stock_data}},
                    "$set" : {
                        "date":last_stock_data["Date"],
                        "open":last_stock_data["Open"],
                        "close":last_stock_data["Close"],
                        "high":last_stock_data["High"],
                        "low":last_stock_data["Low"],
                        "volume":last_stock_data["Volume"],
                    }
                }
            )
                
        except Exception as e:
            raise Exception(f"update_stock_in_db {e} ")
    
    def update_stock_collection(self):
        try:
            stock_datas = self.get_last_date()
            index = 1
            max = len(stock_datas)
            for stock_data in stock_datas:
                new_stock_data,last_stock_data = self.get_new_stock_data(stock_data)
                self.update_stock_in_db(stock_data=stock_data,new_stock_data=new_stock_data,last_stock_data=last_stock_data)
                print(f"updating stock collection {index} / {max}")
                index += 1
        except Exception as e:
            raise Exception(f"StockCtrl update_stock_collection {e} ")