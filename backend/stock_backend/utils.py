from pymongo import MongoClient
from .stock_backend.config import DB_STRING

client = MongoClient(DB_STRING)
db = client['Stock']

stock_collection = db['stock']
users_collection = db['users']