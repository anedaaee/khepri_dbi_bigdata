from utils import stock_collection
import json
class StockCtrl:
    
    def getStocks(self):
        try:
            
            pipeline = [
                {'$project':{
                    '_id':1,
                    'name':1,
                    'volume':1,
                    'open':1,
                    'close':1,
                    'high':1,
                    'low':1,
                }}
            ]
            stocks = stock_collection.aggregate(pipeline=pipeline)
            
            if stocks:
                stocks = list(stocks)
                for stock in stocks:
                    id = str(stock['_id'])
                    stock['_id']=id
                if len(stocks) != 0:
                   return stocks
                else:
                    raise Exception("error happend")
            else:
                raise Exception("error happend")
        except Exception as e:
            print(e)
            raise Exception(str(e))

    def getStock(self,values):
        try:
            pipeline = [
                {"$match":{"_id":values["_id"]}},
                {"$unwind":"$history"},
                {"$match":{
                    "history.date":{"$gt":values['lower_date'],"$lt":values['upper_date']}
                }},
                {"$sort":{"history.date":1}},
                {"$group":{
                    "_id":"$_id",
                    "history":{"$push":"$history"}
                }}
            ]
            stocks = stock_collection.aggregate(pipeline=pipeline)
            
            if stocks:
                stocks = list(stocks)
                for stock in stocks:
                    id = str(stock['_id'])
                    stock['_id']=id
                if len(stocks) != 0:
                    history = stocks[0]
                    
                    pipeline = [{"$match":{"_id":values["_id"]}},
                        {'$project':{
                            '_id':1,
                            'name':1,
                            'volume':1,
                            'open':1,
                            'close':1,
                            'high':1,
                            'low':1,
                        }}
                    ]
                    stocks = stock_collection.aggregate(pipeline=pipeline)
                    
                    if stocks:
                        stocks = list(stocks)
                        for stock in stocks:
                            id = str(stock['_id'])
                            stock['_id']=id
                        if len(stocks) != 0:
                            return stocks,history
                        else:
                            raise Exception("error happend")
                    else:
                        raise Exception("error happend")
                else:
                    raise Exception("error happend")
            else:
                raise Exception("error happend")
        except Exception as e:
            print(e)
            raise Exception(str(e))
