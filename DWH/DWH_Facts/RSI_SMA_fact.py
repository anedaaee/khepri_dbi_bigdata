from database_khperi_dwh import KhepriDWH
from database_khepri_db import KhepriDB
from datetime import datetime,timedelta

class RSI_SMA_Fact:
    
    def __init__(self,khepri_db:KhepriDB,khepri_dbw:KhepriDWH,stocks_data):
        self.khepri_db = khepri_db
        self.khepri_dbw = khepri_dbw
        self.stocks_data = stocks_data
        
    def getStockLastData(self,stock):
        try:
            stock_data = {
                        "code":stock[0],
                        "name":stock[1]
            }
            query = """SELECT name,Volume,`Open`,`Close`,`Date` 
                        FROM khepri_db.PriceHistory ph 
                        WHERE name=%s
                        ORDER BY `Date` DESC 
                        LIMIT 1;"""
                        
            values = self.khepri_db.select_request(query=query,data=[stock_data['code']])
            
            stock_data['volume'] = values[0]['Volume']
            stock_data['open'] = values[0]['Open']
            stock_data['close'] = values[0]['Close']
            
            return stock_data
        
        except Exception as e:
            raise Exception(f" getStockLastDate {str(e)}")


    def insertStockDimention(self,stock):
        try:
                  
            query = """INSERT INTO khepri_dwh.RSI_SMA_d_stock
                    (stock_code, stock_name, volume, `open`, `close`)
                    VALUES(%s, %s, %s, %s, %s);"""
            stock_d_id = self.khepri_dbw.insert_return_id(query=query,data=[stock['code'],stock['name'],stock['volume'],stock['open'],stock['close']])
            
            return stock_d_id
        
        except Exception as e:
            raise Exception(f" insertStockDimention {str(e)}")
        
        
    def insertDateDimention(self):
        try:
        
            today = datetime.now()
            query = """INSERT INTO khepri_dwh.RSI_SMA_d_date
                        (calculate_date)
                        VALUES(%s);"""            
            stock_d_id = self.khepri_dbw.insert_return_id(query=query,data=[today.strftime('%Y-%m-%d')])
            
            return stock_d_id
        
        except Exception as e:
            raise Exception(f"Error happend in insertDateDimention{str(e)}")
        
    def calculateRSI_SMAData(self,stock):
        try:
            
            end_date = datetime.today()

            start_date = end_date - timedelta(days=14)
            
            query = """SELECT  RSIT.RSI , SMAT.SMA
                        FROM(SELECT name , ((SUM(`Open` + `Close` / 2)+1)/100)-100 as RSI
                                FROM khepri_db.PriceHistory ph 
                                WHERE name=%s
                                    AND `Date` <%s
                                    AND `Date` >%s) as RSIT
                        INNER JOIN (SELECT name,(`Open`+`Close`+high+low) AS SMA
                                    FROM khepri_db.PriceHistory ph
                                    WHERE name=%s
                                    ORDER BY `Date` DESC 
                                    LIMIT 1) AS SMAT
                        ON RSIT.name = SMAT.name;"""
            
            
            RSI_SMA_data = self.khepri_db.select_request(query=query,data=[stock['code'],end_date.strftime('%Y-%m-%d'),start_date.strftime('%Y-%m-%d'),stock['code']])
            
            return RSI_SMA_data[0]

        except Exception as e:
            raise Exception(f" calculateRSI_SMAData {str(e)}")
    
    
        
    def insertFact(self,fact_data):
        try:
            query = """INSERT INTO khepri_dwh.RSI_SMA_f
                        (date_id, stock_id, RSI, SMA)
                        VALUES(%s, %s, %s, %s);"""
        
            id = self.khepri_dbw.insert_return_id(query=query,data=[
                fact_data['date_id'],
                fact_data['stock_id'],
                fact_data['RSI'],
                fact_data['SMA']
            ])
            return id
        except Exception as e:
            raise Exception(f" insertFact {str(e)}")
        
    def insertFactAgregate(self,fact_data):
        try:
            query = """INSERT INTO khepri_dwh.RSI_SMA_aggr_average
                    (date_id, stock_id, RSI_SMA_AVG)
                    VALUES( %s, %s, %s);"""
                        
            id = self.khepri_dbw.insert_return_id(query=query,data=[
                fact_data['date_id'],
                fact_data['stock_id'],
                (fact_data['RSI'] + fact_data['SMA'] )/ 2
            ])
            return id
        except Exception as e:
            raise Exception(f" insertFact {str(e)}")
            
    
    def getRSI_SMA_Data(self):
        
        try:
            print("------------- start RSI SMA calculation -------------")
            finish = len(self.stocks_data)
            index = 1
            for stock in self.stocks_data:
                fact_data = {}
                stock_data = self.getStockLastData(stock=stock)
                fact_data['stock_id'] =  self.insertStockDimention(stock=stock_data)
                fact_data['date_id'] = self.insertDateDimention()
                RSI_SMA_data = self.calculateRSI_SMAData(stock=stock_data)
                fact_data['RSI'] = RSI_SMA_data['RSI']
                fact_data['SMA'] = RSI_SMA_data['SMA']
                fact_id = self.insertFact(fact_data=fact_data)
                fact_agr_id = self.insertFactAgregate(fact_data=fact_data)
                print(f"middle completion => {str(index)} / {str(finish)}")
                index +=1
                    
                    
                    
        except Exception as e:
            raise Exception(f" getRSI_SMA_Data {str(e)}")
        
    def find_RSI_SMA(self):
        try:
            self.getRSI_SMA_Data()
        except Exception as e:
            raise Exception(f" find_RSI_SMA {str(e)}")
        
    def start_calculate(self):
        try:
            self.find_RSI_SMA()
        except Exception as e:
            raise Exception(f" RSI_SMA_Fact start_calculate {str(e)}")