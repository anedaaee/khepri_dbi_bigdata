import mysql.connector as mysql
from config import KHEPRYI_DWH_CONFIG

class KhepriDWH:
    
    def __init__(self):
        self.connection =  mysql.connect(
            host=KHEPRYI_DWH_CONFIG['host'],
            user=KHEPRYI_DWH_CONFIG['user'],
            password=KHEPRYI_DWH_CONFIG['password'],
            database=KHEPRYI_DWH_CONFIG['database'],
        )   
        
    def select_request(self,query,data):
        try:
            cursor = self.connection.cursor()
            cursor.execute(query,data)
            
            rows = cursor.fetchall()
            columns = [i[0] for i in cursor.description]
            data = [dict(zip(columns, row)) for row in rows]

            cursor.close()
            return data
        except Exception as e:
                raise Exception(f" KhepriDWH select_request {str(e)}")
    
    def insert_return_id(self,query,data):
        try:
            cursor = self.connection.cursor()
            cursor.execute(query,data)
            self.connection.commit()
            
            inserted_id = cursor.lastrowid
            
            return inserted_id
        except Exception as e:
                raise Exception(f" KhepriDWH insert_return_id {str(e)}")
        
    