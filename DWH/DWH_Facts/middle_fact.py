from database_khperi_dwh import KhepriDWH
from database_khepri_db import KhepriDB
from datetime import datetime,timedelta

class MiddleFact:
    
    def __init__(self,khepri_db:KhepriDB,khepri_dbw:KhepriDWH,stocks_data,date_plans):
        self.khepri_db = khepri_db
        self.khepri_dbw = khepri_dbw
        self.stocks_data = stocks_data
        self.date_plans = date_plans
        
    def getDateRange(self,date_plan):
        today = datetime.now()
        match date_plan:
            case '1m':
                return_date = today - timedelta(days= 1 * 30)
                return return_date.strftime('%Y-%m-%d'),today.strftime('%Y-%m-%d')
            case '3m':
                return_date = today - timedelta(days= 3 * 30)
                return return_date.strftime('%Y-%m-%d'),today.strftime('%Y-%m-%d')
            case '6m':
                return_date = today - timedelta(days= 6 * 30)
                return return_date.strftime('%Y-%m-%d'),today.strftime('%Y-%m-%d')
            case '1y':
                return_date = today.replace(year=today.year - 1)
                return return_date.strftime('%Y-%m-%d'),today.strftime('%Y-%m-%d')
            case '3y':
                return_date = today.replace(year=today.year - 3)
                return return_date.strftime('%Y-%m-%d'),today.strftime('%Y-%m-%d')
            case '5y':
                return_date = today.replace(year=today.year - 5)
                return return_date.strftime('%Y-%m-%d'),today.strftime('%Y-%m-%d')
            case '10y':
                return_date = today.replace(year=today.year - 10)
                return return_date.strftime('%Y-%m-%d'),today.strftime('%Y-%m-%d')

    def insertStockDimention(self,stock):
        try:
            stock_data = {
                        "code":stock[0],
                        "name":stock[1]
            }
            
            
            query = """SELECT Volume
                        FROM khepri_db.PriceHistory
                        WHERE name=%s
                        ORDER BY `Date` DESC 
                        LIMIT 1;"""

            
            volume = self.khepri_db.select_request(query=query,data=[stock_data['code']])
            volume = volume[0]['Volume']
            stock_data['volume'] = volume
            
            query = """INSERT INTO khepri_dwh.middle_d_stock
                        ( stock_code, stock_name, stock_volume)
                        VALUES(%s, %s, %s);"""
                        
            stock_d_id = self.khepri_dbw.insert_return_id(query=query,data=(stock_data['code'],stock_data['name'],stock_data['volume']))
            
            return stock_d_id
        
        except Exception as e:
            raise Exception(f" insertStockDimention {str(e)}")
        
        
    def insertDateDimention(self,start_date,end_date,date_plan):
        try:
        
            
            query = """INSERT INTO khepri_dwh.middle_d_date
                        (create_ad, start_date, end_date, date_group)
                        VALUES( %s, %s, %s, %s);"""
                        
            stock_d_id = self.khepri_dbw.insert_return_id(query=query,data=[end_date,start_date,end_date,date_plan])
            
            return stock_d_id
        
        except Exception as e:
            raise Exception(f"Error happend in insertDateDimention{str(e)}")
        
    def calculateMiddleData(self,start_date,end_date,stock):
        try:
            query_close = """SELECT name,`Close` as value
                        FROM khepri_db.PriceHistory ph1
                        WHERE name = %s
                            AND 
                            ph1.`Date`  > %s
                            AND 
                            ph1.`Date`  < %s
                        ORDER BY `Close` ASC;"""    
                        
            query_open = """SELECT name,`Open` as value
                        FROM khepri_db.PriceHistory ph1
                        WHERE name = %s
                            AND 
                            ph1.`Date`  > %s
                            AND 
                            ph1.`Date`  < %s
                        ORDER BY `Open` ASC;""" 
                          
            query_high = """SELECT name,High as value
                        FROM khepri_db.PriceHistory ph1
                        WHERE name = %s
                            AND 
                            ph1.`Date`  > %s
                            AND 
                            ph1.`Date`  < %s
                        ORDER BY High ASC;"""  
                         
            query_low= """SELECT name,Low as value
                        FROM khepri_db.PriceHistory ph1
                        WHERE name = %s
                            AND 
                            ph1.`Date`  > %s
                            AND 
                            ph1.`Date`  < %s
                        ORDER BY Low ASC;"""   
            serted_values = {}
            serted_values['open'] = self.khepri_db.select_request(query=query_open,data=(stock[0],start_date,end_date))
            serted_values['close'] = self.khepri_db.select_request(query=query_close,data=(stock[0],start_date,end_date))
            serted_values['high'] = self.khepri_db.select_request(query=query_high,data=(stock[0],start_date,end_date))
            serted_values['low'] = self.khepri_db.select_request(query=query_low,data=(stock[0],start_date,end_date))
            
            middle = {
                'open':0,
                'close':0,
                'high':0,
                'low':0,
            }
            
            if len(serted_values['open']) % 2 == 0:
                middle_index = len(serted_values['open']) // 2
                middle['open'] = (serted_values['open'][middle_index - 1]['value'] + serted_values['open'][middle_index]['value']) / 2
            else:
                middle_index = len(serted_values['open']) // 2
                middle['open'] = serted_values['open'][middle_index]['value']
            
            if len(serted_values['close']) % 2 == 0:
                middle_index = len(serted_values['close']) // 2
                middle['close'] = (serted_values['close'][middle_index - 1]['value'] + serted_values['close'][middle_index]['value']) / 2
            else:
                middle_index = len(serted_values['close']) // 2
                middle['close'] = serted_values['close'][middle_index]['value']
            
            if len(serted_values['high']) % 2 == 0:
                middle_index = len(serted_values['high']) // 2
                middle['high'] = (serted_values['high'][middle_index - 1]['value'] + serted_values['high'][middle_index]['value']) / 2
            else:
                middle_index = len(serted_values['high']) // 2
                middle['high'] = serted_values['high'][middle_index]['value']
            
            if len(serted_values['low']) % 2 == 0:
                middle_index = len(serted_values['low']) // 2
                middle['low'] = (serted_values['low'][middle_index - 1]['value'] + serted_values['low'][middle_index]['value']) / 2
            else:
                middle_index = len(serted_values['low']) // 2
                middle['low'] = serted_values['low'][middle_index]['value']
            
            
            return middle

        except Exception as e:
            raise Exception(f" calculateMiddleData {str(e)}")
    
    
        
    def insertFact(self,fact_data):
        try:
            query = """INSERT INTO khepri_dwh.middle_f
                        (stock_id, date_id, `open`, `close`, high, low)
                        VALUES(%s, %s, %s, %s, %s, %s);"""
        
            id = self.khepri_dbw.insert_return_id(query=query,data=[
                fact_data['stock_id'],
                fact_data['date_id'],
                fact_data['middle']['open'],
                fact_data['middle']['close'],
                fact_data['middle']['high'],
                fact_data['middle']['low']
            ])
            return id
        except Exception as e:
            raise Exception(f" insertFact {str(e)}")
        
    def insertFactAgregate(self,fact_data):
        try:
            query = """INSERT INTO khepri_dwh.middle_aggr
                        ( stock_id, date_id, `open`, `close`)
                        VALUES(%s, %s, %s, %s);"""
                        
            id = self.khepri_dbw.insert_return_id(query=query,data=[
                fact_data['stock_id'],
                fact_data['date_id'],
                fact_data['middle']['open'],
                fact_data['middle']['close']
            ])
            return id
        except Exception as e:
            raise Exception(f" insertFact {str(e)}")
            
    
    def getMiddleData(self):
        
        try:
            print("------------- start middle calculation -------------")
            finish = len(self.stocks_data) * len(self.date_plans) 
            index = 1
            for stock in self.stocks_data:
                for date_plan in self.date_plans:
                    fact_data = {}
                    start_date,end_date  = self.getDateRange(date_plan=date_plan)
                    fact_data['stock_id'] =  self.insertStockDimention(stock=stock)
                    fact_data['date_id'] = self.insertDateDimention(start_date=start_date,end_date=end_date,date_plan=date_plan)
                    fact_data['middle'] = self.calculateMiddleData(start_date=start_date,end_date=end_date,stock=stock)
                    fact_id = self.insertFact(fact_data=fact_data)
                    fact_agr_id = self.insertFactAgregate(fact_data=fact_data)
                    print(f"middle completion => {str(index)} / {str(finish)}")
                    index +=1
                    
                    
                    
        except Exception as e:
            raise Exception(f" getMiddleData {str(e)}")
        
    def findAverage(self):
        try:
            self.getMiddleData()
        except Exception as e:
            raise Exception(f" findAverage {str(e)}")
        
    def start_calculate(self):
        try:
            self.findAverage()
        except Exception as e:
            raise Exception(f" MiddleFact start_calculate {str(e)}")