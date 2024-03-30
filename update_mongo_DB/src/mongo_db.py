from pymongo import MongoClient
from src.config_data import DB_STRING

client = MongoClient(DB_STRING)
db = client['Stock']

stock_collection = db['stock']
users_collection = db['users']
