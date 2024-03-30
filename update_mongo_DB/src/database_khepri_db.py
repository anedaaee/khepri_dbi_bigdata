import mysql.connector as mysql
from src.config_data import KHEPRYI_DB_CONFIG

class KhepriDB:
    
    def __init__(self):
        self.connection =  mysql.connect(
            host=KHEPRYI_DB_CONFIG['host'],
            user=KHEPRYI_DB_CONFIG['user'],
            password=KHEPRYI_DB_CONFIG['password'],
            database=KHEPRYI_DB_CONFIG['database'],
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
            raise Exception(f" KhepriDB select_request {str(e)}")
    