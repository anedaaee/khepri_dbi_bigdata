from update_khepri_db import update
from DWH.main import main as update_dwh
from update_mongo_DB.main import main as update_mongo
import sys
import time
import schedule
from datetime import datetime
def update_all_DBMS(argv):
    print(f"start at {str(datetime.now())}")
    try:
        if len(argv) == 1:
            Methods = 'nasdaq'

        else:
            Methods = argv[1]       
                
        pr = update.Update(Methods)
        pr.db_update()
        update_dwh()
        update_mongo()
        
    except Exception as e:
        print(e)
        
    print(f"finish at {str(datetime.now())}")
        
        

if __name__ == "__main__":
    schedule.every().day.at("00:00").do(update_all_DBMS,sys.argv)
    while True:
        schedule.run_pending()
   