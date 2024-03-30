from database_khperi_dwh import KhepriDWH
from database_khepri_db import KhepriDB
from datetime import datetime,timedelta

class AverageFact:
    
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
            raise Exception(f"Error happend in insertDateDimention {str(e)}")
        
    def calculateAverageData(self,start_date,end_date,stock):
        try:
            query = """SELECT name,
                AVG(`Close`) as close_avg, 
                AVG(`Open`) as  open_avg, 
                AVG(High) as high_avg,
                AVG(Low) as low_avg
                FROM khepri_db.PriceHistory ph
                WHERE name = %s 
                    AND 
                    ph.`Date`  > %s
                    AND 
                    ph.`Date`  < %s
                GROUP BY name
                LIMIT 1
                ;"""    
            
            average = self.khepri_db.select_request(query=query,data=(stock[0],start_date,end_date))
            return average
        
        except Exception as e:
            raise Exception(f" calculateAverageData {str(e)}")
    
    
    def insertFact(self,fact_data):
        try:
            query = """INSERT INTO khepri_dwh.average_middle_mode_variance_f
                        (stock_id, date_id, `open`, `close`, high, low , fact_detail_id)
                        VALUES(%s, %s, %s, %s, %s, %s , 1);"""
                        
            id = self.khepri_dbw.insert_return_id(query=query,data=[
                fact_data['stock_id'],
                fact_data['date_id'],
                fact_data['open'],
                fact_data['close'],
                fact_data['high'],
                fact_data['low']
            ])
            return id
        except Exception as e:
            print(e)
            raise Exception(f" insertFact {str(e)}")
        
    def insertFactAgregate(self,fact_data):
        try:
            query = """INSERT INTO khepri_dwh.average_middle_mode_variance_aggr_open_close
                        ( stock_id, date_id, `open`, `close` , fact_detail_id)
                        VALUES(%s, %s, %s, %s , 1);"""
                        
            id = self.khepri_dbw.insert_return_id(query=query,data=[
                fact_data['stock_id'],
                fact_data['date_id'],
                fact_data['open'],
                fact_data['close']
            ])
            return id
        except Exception as e:
            raise Exception(f" insertFact {str(e)}")
            
    
    def getAverageData(self):
        try:
            print("------------- start average calculation -------------")
            finish = len(self.stocks_data) * len(self.date_plans) 
            index = 1
            for stock in self.stocks_data:
                for date_plan in self.date_plans:
                    fact_data = {}
                    start_date,end_date  = self.getDateRange(date_plan=date_plan)
                    fact_data['stock_id'] =  self.insertStockDimention(stock=stock)
                    fact_data['date_id'] = self.insertDateDimention(start_date=start_date,end_date=end_date,date_plan=date_plan)
                    average = self.calculateAverageData(start_date=start_date,end_date=end_date,stock=stock)
                    fact_data['open'] = average[0]['open_avg']
                    fact_data['close'] = average[0]['close_avg']
                    fact_data['high'] = average[0]['high_avg']
                    fact_data['low'] = average[0]['low_avg']
                    fact_id = self.insertFact(fact_data=fact_data)
                    fact_agr_id = self.insertFactAgregate(fact_data=fact_data)
                    print(f"average completion => {str(index)} / {str(finish)}")
                    index +=1
                    
                    
                    
        except Exception as e:
            raise Exception(f" getAverageData {str(e)}")
        
    def findAverage(self):
        try:
            self.getAverageData()
        except Exception as e:
            raise Exception(f" findAverage {str(e)}")
        
    def start_calculate(self):
        try:
            self.findAverage()
        except Exception as e:
            raise Exception(f" AverageFact start_calculate {str(e)}")