from database_khepri_db import KhepriDB
from database_khperi_dwh import KhepriDWH
from DWH_Facts.average_fact import AverageFact
from DWH_Facts.variance_fact import VarianceFact
from DWH_Facts.middle_fact import MiddleFact
from DWH_Facts.mode_fact import ModeFact

import csv

class UpdateDWH:
    
    def __init__(self,khepri_db:KhepriDB,khepri_dwh:KhepriDWH):
        self.khepri_db = khepri_db
        self.khepri_dwh = khepri_dwh
        self.stocks_data = self.read_stocks_data()
        self.date_plans = ['1m','3m','6m','1y','3y','5y','10y']
        
        self.average_fact = AverageFact(khepri_db=self.khepri_db,khepri_dbw=self.khepri_dwh,stocks_data=self.stocks_data,date_plans=self.date_plans)
        self.variance_fact = VarianceFact(khepri_db=self.khepri_db,khepri_dbw=self.khepri_dwh,stocks_data=self.stocks_data,date_plans=self.date_plans)
        self.middle_fact = MiddleFact(khepri_db=self.khepri_db,khepri_dbw=self.khepri_dwh,stocks_data=self.stocks_data,date_plans=self.date_plans)
        self.mode_fact = ModeFact(khepri_db=self.khepri_db,khepri_dbw=self.khepri_dwh,stocks_data=self.stocks_data,date_plans=self.date_plans)
        
    def read_stocks_data(self):
        try:
            file = open("./db_list.csv")
            csvreader = csv.reader(file)
            header = next(csvreader)
            rows = []
            for row in csvreader:
                rows.append(row)
            return rows
        except Exception as e:
                raise Exception(f" UpdateDWH read_stocks_data {str(e)}")
            
        
    def update(self):
        try:    
            self.average_fact.start_calculate()
            self.variance_fact.start_calculate()
            self.middle_fact.start_calculate()
            self.mode_fact.start_calculate()
        except Exception as e:
            raise Exception(f" UpdateDWH update {str(e)}")
        