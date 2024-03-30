from database_khperi_dwh import KhepriDWH
from database_khepri_db import KhepriDB
from datetime import datetime,timedelta

class Stochastics_fact:
    
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
            
            
            query = """SELECT Volume,`High`,`Low` 
                        FROM khepri_db.PriceHistory
                        WHERE name=%s
                        ORDER BY `Date` DESC 
                        LIMIT 1;"""

            
            values = self.khepri_db.select_request(query=query,data=[stock_data['code']])
            stock_data['volume'] = values[0]['Volume']
            stock_data['high'] = values[0]['High']
            stock_data['low'] = values[0]['Low']
            query = """INSERT INTO khepri_dwh.stochastics_d_stock
                        (stock_code, stock_name, stock_volume, High, Low)
                        VALUES(%s, %s, %s, %s, %s);"""
                        
            stock_d_id = self.khepri_dbw.insert_return_id(query=query,data=(stock_data['code'],stock_data['name'],stock_data['volume'],stock_data['high'],stock_data['low']))
            
            return stock_d_id
        
        except Exception as e:
            raise Exception(f" insertStockDimention {str(e)}")
        
        
    def insertDateDimention(self,start_date,end_date,date_plan):
        try:
        
            
            query = """INSERT INTO khepri_dwh.stochastics_d_date
                        (create_ad, start_date, end_date, date_group)
                        VALUES( %s, %s, %s, %s);"""
                        
            stock_d_id = self.khepri_dbw.insert_return_id(query=query,data=[end_date,start_date,end_date,date_plan])
            
            return stock_d_id
        
        except Exception as e:
            raise Exception(f"Error happend in insertDateDimention{str(e)}")
        
    def calculateStochasticData(self,start_date,end_date,stock):
        try:
            query = """SELECT name,(close_avg - Low_min)/(high_max - Low_min) * 100 AS Stochastics
                                FROM(SELECT name,AVG(`Close`) AS close_avg 
                                        , MIN(Low) AS Low_min 
                                        , MAX('HIGH') AS high_max
                                    FROM khepri_db.PriceHistory ph 
                                    WHERE name=%s
                                        AND `Date` >= %s
                                        AND `Date` <= %s
                                    GROUP BY name
                                    LIMIT 1) AS data_table
                                LIMIT 1;
                                """    
                        
            data = self.khepri_db.select_request(query=query,data=(stock[0],start_date,end_date))
            
            return data[0]['Stochastics']

        except Exception as e:
            raise Exception(f" calculateStochasticData {str(e)}")
    
    
        
    def insertFact(self,fact_data):
        try:
            query = """INSERT INTO khepri_dwh.stochastics_f
                        (stock_id, date_id, stochastics)
                        VALUES(%s, %s, %s);"""
        
            id = self.khepri_dbw.insert_return_id(query=query,data=[
                fact_data['stock_id'],
                fact_data['date_id'],
                fact_data['stochastics']
            ])
            return id
        except Exception as e:
            raise Exception(f" insertFact {str(e)}")
        
    def insertFactAgregate(self,fact_data):
        try:
            query = """INSERT INTO khepri_dwh.stochastics_d_aggr_year_data
                        (stock_id, date_id, stochastics)
                        VALUES(%s, %s, %s);"""
        
            id = self.khepri_dbw.insert_return_id(query=query,data=[
                fact_data['stock_id'],
                fact_data['date_id'],
                fact_data['stochastics']
            ])
            return id
        except Exception as e:
            raise Exception(f" insertFact {str(e)}")
            
    
    def getStochasticData(self):
        
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
                    fact_data['stochastics'] = self.calculateStochasticData(start_date=start_date,end_date=end_date,stock=stock)
                    fact_id = self.insertFact(fact_data=fact_data)
                    fact_agr_id = self.insertFactAgregate(fact_data=fact_data)
                    print(f"middle completion => {str(index)} / {str(finish)}")
                    index +=1
                    
                    
                    
        except Exception as e:
            raise Exception(f" getStochasticData {str(e)}")
        
    def findStochastic(self):
        try:
            self.getStochasticData()
        except Exception as e:
            raise Exception(f" findStochastic {str(e)}")
        
    def start_calculate(self):
        try:
            self.findStochastic()
        except Exception as e:
            raise Exception(f" Stochastics_fact start_calculate {str(e)}")