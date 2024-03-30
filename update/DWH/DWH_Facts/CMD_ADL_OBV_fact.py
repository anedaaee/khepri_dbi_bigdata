from database_khperi_dwh import KhepriDWH
from database_khepri_db import KhepriDB
from datetime import datetime

class CMD_ADL_OBV_Fact:
    
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
                  
            query = """INSERT INTO khepri_dwh.CMD_ADL_OBV_d_stock
                    (stock_code, stock_name, volume, `open`, `close`)
                    VALUES(%s, %s, %s, %s, %s);"""
            stock_d_id = self.khepri_dbw.insert_return_id(query=query,data=[stock['code'],stock['name'],stock['volume'],stock['open'],stock['close']])
            
            return stock_d_id
        
        except Exception as e:
            raise Exception(f" insertStockDimention {str(e)}")
        
        
    def insertDateDimention(self):
        try:
        
            today = datetime.now()
            query = """INSERT INTO khepri_dwh.CMD_ADL_OBV_d_date
                        (calculate_date)
                        VALUES(%s);"""            
            stock_d_id = self.khepri_dbw.insert_return_id(query=query,data=[today.strftime('%Y-%m-%d')])
            
            return stock_d_id
        
        except Exception as e:
            raise Exception(f"Error happend in insertDateDimention{str(e)}")
        
    def calculate_CMD_ADL_OBV_Data(self,stock):
        try:
            
            query = """SELECT CMFT.name,CMFT.CMF  ,OBV_ADLT.OBV,OBV_ADLT.ADL
                        FROM(SELECT name,(Volume *(High - Low))/((High - Low) - (`Close` - Low) * 20) AS CMF 
                            FROM khepri_db.PriceHistory ph
                            WHERE name=%s
                            ORDER BY `Date` DESC
                            LIMIT 1) AS CMFT
                        INNER JOIN (SELECT OBVT.name, OBVT.OBV , ADLT.ADL
                            FROM
                                (SELECT name ,(t.lastday_close - t.today_close) * t.Volume AS OBV
                                FROM(
                                    (SELECT today_t.name,today_t.`Close` as today_close , lastday_t.`Close` as lastday_close , today_t.Volume 
                                    FROM (SELECT name,`Close`,Volume
                                        FROM khepri_db.PriceHistory ph 
                                        WHERE name=%s
                                        ORDER BY `Date` DESC
                                        LIMIT 1) AS today_t
                                    INNER JOIN (SELECT name,`Close`
                                        FROM khepri_db.PriceHistory ph 
                                        WHERE name=%s
                                        ORDER BY `Date` DESC
                                        LIMIT 1 OFFSET 1) AS lastday_t
                                    ON today_t.name = lastday_t.name)
                                ) AS t
                                ) AS OBVT
                            INNER JOIN (SELECT name ,(t.lastday_close + t.today_low - t.today_high - t.today_close) * t.Volume AS ADL
                                FROM(
                                    (SELECT today_t.name,today_t.`Close` as today_close , lastday_t.`Close` as lastday_close ,
                                        today_t.High AS today_high,today_t.Low AS today_low, today_t.Volume 
                                    FROM (SELECT name,`Close`,Volume,High,Low
                                        FROM khepri_db.PriceHistory ph 
                                        WHERE name=%s
                                        ORDER BY `Date` DESC
                                        LIMIT 1) AS today_t
                                    INNER JOIN (SELECT name,`Close`
                                        FROM khepri_db.PriceHistory ph 
                                        WHERE name=%s
                                        ORDER BY `Date` DESC
                                        LIMIT 1 OFFSET 1) AS lastday_t
                                    ON today_t.name = lastday_t.name)
                                ) AS t) AS ADLT) AS OBV_ADLT
                        ON OBV_ADLT.name = CMFT.name
                        LIMIT 1;
                        """
            
            
            CMD_ADL_OBV_data = self.khepri_db.select_request(query=query,data=[stock['code'],stock['code'],stock['code'],stock['code'],stock['code']])
            
            return CMD_ADL_OBV_data[0]

        except Exception as e:
            raise Exception(f" calculate_CMD_ADL_OBV_Data {str(e)}")
    
    
        
    def insertFact(self,fact_data):
        try:
            query = """INSERT INTO khepri_dwh.CMD_ADL_OBV_f
                    (stock_id, date_id, CMD, ADL, OBV)
                    VALUES(%s, %s, %s, %s, %s);"""
        
            id = self.khepri_dbw.insert_return_id(query=query,data=[
                fact_data['date_id'],
                fact_data['stock_id'],
                fact_data['CMD'],
                fact_data['ADL'],
                fact_data['OBV'],
            ])
            return id
        except Exception as e:
            raise Exception(f" insertFact {str(e)}")
        
    def insertFactAgregate(self,fact_data):
        try:
            query = """INSERT INTO khepri_dwh.CDM_ADL_OBV_aggr
                        (stock_id, date_id, CMD, ADL)
                        VALUES(%s, %s, %s, %s);"""
                        
            id = self.khepri_dbw.insert_return_id(query=query,data=[
                fact_data['date_id'],
                fact_data['stock_id'],
                fact_data['CMD'],
                fact_data['ADL']
            ])
            return id
        except Exception as e:
            raise Exception(f" insertFact {str(e)}")
            
    
    def get_CMD_ADL_OBV_Data(self):
        
        try:
            print("------------- start RSI SMA calculation -------------")
            finish = len(self.stocks_data)
            index = 1
            for stock in self.stocks_data:
                fact_data = {}
                stock_data = self.getStockLastData(stock=stock)
                fact_data['stock_id'] =  self.insertStockDimention(stock=stock_data)
                fact_data['date_id'] = self.insertDateDimention()
                RSI_SMA_data = self.calculate_CMD_ADL_OBV_Data(stock=stock_data)
                fact_data['CMD'] = RSI_SMA_data['CMF']
                fact_data['OBV'] = RSI_SMA_data['OBV']
                fact_data['ADL'] = RSI_SMA_data['ADL']
                fact_id = self.insertFact(fact_data=fact_data)
                fact_agr_id = self.insertFactAgregate(fact_data=fact_data)
                print(f"middle completion => {str(index)} / {str(finish)}")
                index +=1
                    
                    
                    
        except Exception as e:
            raise Exception(f" get_CMD_ADL_OBV_Data {str(e)}")
        
    def find_CMD_ADL_OBV(self):
        try:
            self.get_CMD_ADL_OBV_Data()
        except Exception as e:
            raise Exception(f" find_CMD_ADL_OBV {str(e)}")
        
    def start_calculate(self):
        try:
            self.find_CMD_ADL_OBV()
        except Exception as e:
            raise Exception(f" CMD_ADL_OBV_Fact start_calculate {str(e)}")