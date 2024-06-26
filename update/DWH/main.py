import sys
sys.path.append('DWH')

from database_khperi_dwh import KhepriDWH
from database_khepri_db import KhepriDB
from update_dwh import UpdateDWH

def main():
    
    khepri_db = KhepriDB()
    khepri_dwh = KhepriDWH()
    
    update = UpdateDWH(khepri_db,khepri_dwh)  
    try:
        update.update()
    except Exception as e:
        raise Exception(f" main {str(e)}")
    
if __name__ == '__main__':
    try:
        sys.exit(main())
    except Exception as e:
        print(f"Error happend at {e}")