from src.database_khepri_db import KhepriDB
from src.mongo_db import stock_collection,users_collection
from src.update_mongo import UpdateMongo
import sys


def main():
    try:
        khepri_db = KhepriDB()
        update_mongo = UpdateMongo(khepri_db=khepri_db,users_collection=users_collection,stock_collection=stock_collection)
        update_mongo.update()
    except Exception as e:
        raise Exception(f"main {e} ")


if __name__ == '__main__':
    try:
        sys.exit(main())
    except Exception as e:
        print(f"Error happend at {e}")