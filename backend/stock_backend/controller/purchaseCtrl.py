from utils import users_collection,stock_collection
from purchase.models import Purchases,Wallet
from datetime import datetime

class PurchaseCtrl:
    
    def purchase(self,values):
        try:
            
            pipeline = [
                {'$match':{'_id':values['stock']}},
                {'$project':{
                    '_id':1,
                    'name':1,
                    'date':1,
                    'close':1,
                    'open':1,
                    'high':1,
                    'low':1,
                    'volume':1,
                }}
            ]
            stocks = stock_collection.aggregate(pipeline=pipeline)
            
            if stocks:
                stocks = list(stocks)
                for stock in stocks:
                    id = str(stock['_id'])
                    stock['_id']=id
                if len(stocks) == 1:
                    stock = stocks[0]
                    
                    pipeline = [
                        {'$match':{'_id':values['user']}},
                        {'$unwind':'$wallet'},
                        {'$match':{'wallet._id' : stock['_id']}}
                    ]
                    
                    users = list(users_collection.aggregate(pipeline=pipeline))
                
                    for user in users:
                        id = str(user['_id'])
                        user['_id']=id
                        id = str(user['wallet']['_id'])
                        user['wallet']['_id'] = id
                             
                    if len(users) == 0:
                            new_wallet = stock
                            new_wallet['number'] = values['number']
                            users_collection.update_one({"_id":values['user']}
                                                        ,{"$push":{"wallet":new_wallet}})
                    else:            
                        wallet = users[0]['wallet']
                        print(wallet)
                        wallet['number'] += values['number']
                        users_collection.update_one({"_id":values['user'],"wallet._id":values['stock']},
                                                    {"$set":{"wallet.$":wallet}})
                        
                    td = datetime.now()
                    purchases = {
                        "_id":td,
                        "stock":values['stock'],
                        "number":values['number'],
                        "purchaseORsale":"purchase"
                    }
                    users_collection.update_one({"_id":values['user']},
                                                {"$push":{"purchases":purchases}})
                           
                else:
                    raise Exception("invalid stock id")
            else:
                raise Exception("invalid stock id")
        except Exception as e:
            print(e)
            raise Exception(str(e))
        
    def sale(self,values):
        try:
            
            pipeline = [
                {'$match':{'_id':values['stock']}},
                {'$project':{
                    '_id':1,
                    'name':1,
                    'date':1,
                    'close':1,
                    'open':1,
                    'high':1,
                    'low':1,
                    'volume':1,
                }}
            ]
            stocks = stock_collection.aggregate(pipeline=pipeline)
            
            if stocks:
                stocks = list(stocks)
                for stock in stocks:
                    id = str(stock['_id'])
                    stock['_id']=id
                if len(stocks) == 1:
                    stock = stocks[0]
                    
                    pipeline = [
                        {'$match':{'_id':values['user']}},
                        {'$unwind':'$wallet'},
                        {'$match':{'wallet._id' : stock['_id']}}
                    ]
                    
                    users = list(users_collection.aggregate(pipeline=pipeline))
                
                    for user in users:
                        id = str(user['_id'])
                        user['_id']=id
                        id = str(user['wallet']['_id'])
                        user['wallet']['_id'] = id
                             
                    if len(users) == 0:
                            raise Exception("you dont have this stock")
                    else:            
                        wallet = users[0]['wallet']
                        print(wallet)
                        wallet['number'] -= values['number']
                        if(wallet['number'] < 0):
                            raise Exception("you dont have enought this stock")
                        else:
                            
                            users_collection.update_one({"_id":values['user'],"wallet._id":values['stock']},
                                                    {"$set":{"wallet.$":wallet}})
                            td = datetime.now()
                            purchases = {
                                "_id":td,
                                "stock":values['stock'],
                                "number":values['number'],
                                "purchaseORsale":"sale"
                            }
                            users_collection.update_one({"_id":values['user']},
                                                        {"$push":{"purchases":purchases}})
                           
                else:
                    raise Exception("invalid stock id")
            else:
                raise Exception("invalid stock id")
        except Exception as e:
            print(e)
            raise Exception(str(e))

