from database_khperi_dwh import KhepriDWH
from database_khepri_db import KhepriDB
from datetime import datetime,timedelta

class ModeFact:
    
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
            
            query = """INSERT INTO khepri_dwh.average_middle_mode_variance_d_stock
                        ( stock_code, stock_name, stock_volume)
                        VALUES(%s, %s, %s);"""
            
            stock_d_id = self.khepri_dbw.insert_return_id(query=query,data=(stock_data['code'],stock_data['name'],stock_data['volume']))
            
            return stock_d_id
        
        except Exception as e:
            raise Exception(f" insertStockDimention {str(e)}")
        
        
    def insertDateDimention(self,start_date,end_date,date_plan):
        try:
        
            
            query = """INSERT INTO khepri_dwh.average_middle_mode_variance_d_date
                        (create_ad, start_date, end_date, date_group)
                        VALUES( %s, %s, %s, %s);"""
                        
            stock_d_id = self.khepri_dbw.insert_return_id(query=query,data=[end_date,start_date,end_date,date_plan])
            
            return stock_d_id
        
        except Exception as e:
            raise Exception(f"Error happend in insertDateDimention{str(e)}")
        
    def calculateModeData(self,start_date,end_date,stock):
        try:
            query_close = """SELECT AVG(`Close`) as avg_mod,mod_value 
                            FROM
                                ( SELECT `Close`,MAX(close_count) as mod_value
                                FROM 
                                    ( SELECT name,`Close`,COUNT(`Close`) as close_count
                                    FROM khepri_db.PriceHistory ph
                                    WHERE name = %s
                                        AND 
                                        ph.`Date`  > %s
                                        AND 
                                        ph.`Date`  < %s
                                    GROUP BY `Close`) AS TB1
                                GROUP BY `Close` ) AS TB2
                            GROUP BY mod_value
                            ORDER BY mod_value DESC
                            LIMIT 1;"""    
                        
            query_open = """SELECT AVG(`Open`) as avg_mod,mod_value 
                            FROM
                                ( SELECT `Open`,MAX(open_count) as mod_value
                                FROM 
                                    ( SELECT name,`Open`,COUNT(`Open`) as open_count
                                    FROM khepri_db.PriceHistory ph
                                    WHERE name = %s 
                                        AND 
                                        ph.`Date`  > %s
                                        AND 
                                        ph.`Date`  < %s
                                    GROUP BY `Open`) AS TB1
                                GROUP BY `Open` ) AS TB2
                            GROUP BY mod_value
                            ORDER BY mod_value DESC
                            LIMIT 1;"""  
                          
            query_high = """SELECT AVG(High) as avg_mod,mod_value 
                            FROM
                                ( SELECT High,MAX(high_count) as mod_value
                                FROM 
                                    ( SELECT name,High,COUNT(High) as high_count
                                    FROM khepri_db.PriceHistory ph
                                    WHERE name = %s
                                        AND 
                                        ph.`Date`  > %s
                                        AND 
                                        ph.`Date`  < %s
                                    GROUP BY High) AS TB1
                                GROUP BY High ) AS TB2
                            GROUP BY mod_value
                            ORDER BY mod_value DESC
                            LIMIT 1;"""  
                         
            query_low= """SELECT AVG(Low) as avg_mod,mod_value 
                            FROM
                                ( SELECT Low,MAX(low_count) as mod_value
                                FROM 
                                    ( SELECT name,Low,COUNT(Low) as low_count
                                    FROM khepri_db.PriceHistory ph
                                    WHERE name = %s
                                        AND 
                                        ph.`Date`  > %s
                                        AND 
                                        ph.`Date`  < %s
                                    GROUP BY Low) AS TB1
                                GROUP BY Low ) AS TB2
                            GROUP BY mod_value
                            ORDER BY mod_value DESC
                            LIMIT 1;"""    
            values = {}
            values['open'] = self.khepri_db.select_request(query=query_open,data=(stock[0],start_date,end_date))
            values['close'] = self.khepri_db.select_request(query=query_close,data=(stock[0],start_date,end_date))
            values['high'] = self.khepri_db.select_request(query=query_high,data=(stock[0],start_date,end_date))
            values['low'] = self.khepri_db.select_request(query=query_low,data=(stock[0],start_date,end_date))
            
            mode = {
                'open':values['open'][0]['avg_mod'],
                'close':values['close'][0]['avg_mod'],
                'high':values['high'][0]['avg_mod'],
                'low':values['low'][0]['avg_mod'],
            }
            
            return mode

        except Exception as e:
            raise Exception(f" calculateMiddleData {str(e)}")
    
    
        
    def insertFact(self,fact_data):
        try:
            query = """INSERT INTO khepri_dwh.average_middle_mode_variance_f
                        (stock_id, date_id, `open`, `close`, high, low,fact_detail_id)
                        VALUES(%s, %s, %s, %s, %s, %s,3);"""
        
            id = self.khepri_dbw.insert_return_id(query=query,data=[
                fact_data['stock_id'],
                fact_data['date_id'],
                fact_data['mode']['open'],
                fact_data['mode']['close'],
                fact_data['mode']['high'],
                fact_data['mode']['low']
            ])
            return id
        except Exception as e:
            raise Exception(f" insertFact {str(e)}")
        
    def insertFactAgregate(self,fact_data):
        try:
            query = """INSERT INTO khepri_dwh.average_middle_mode_variance_aggr_open_close
                        ( stock_id, date_id, `open`, `close`,fact_detail_id)
                        VALUES(%s, %s, %s, %s,3);"""
                        
            id = self.khepri_dbw.insert_return_id(query=query,data=[
                fact_data['stock_id'],
                fact_data['date_id'],
                fact_data['mode']['open'],
                fact_data['mode']['close']
            ])
            return id
        except Exception as e:
            raise Exception(f" insertFact {str(e)}")
            
    
    def getModeData(self):
        try:
            print("------------- start mode calculation -------------")
            finish = len(self.stocks_data) * len(self.date_plans) 
            index = 1
            for stock in self.stocks_data:
                for date_plan in self.date_plans:
                    fact_data = {}
                    start_date,end_date  = self.getDateRange(date_plan=date_plan)
                    fact_data['stock_id'] =  self.insertStockDimention(stock=stock)
                    fact_data['date_id'] = self.insertDateDimention(start_date=start_date,end_date=end_date,date_plan=date_plan)
                    fact_data['mode'] = self.calculateModeData(start_date=start_date,end_date=end_date,stock=stock)
                    fact_id = self.insertFact(fact_data=fact_data)
                    fact_agr_id = self.insertFactAgregate(fact_data=fact_data)
                    print(f"mode completion => {str(index)} / {str(finish)}")
                    index +=1
                    
                    
                    
        except Exception as e:
            raise Exception(f" getMiddleData {str(e)}")
        
    def findAverage(self):
        try:
            self.getModeData()
        except Exception as e:
            raise Exception(f" findAverage {str(e)}")
        
    def start_calculate(self):
        try:
            self.findAverage()
        except Exception as e:
            raise Exception(f" ModeFact start_calculate {str(e)}")