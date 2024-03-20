from pydantic import BaseModel
from datetime import datetime,date


class Wallet(BaseModel):
    id:str
    stock:str
    number:int
    total_value:float
    open:float
    close:float
    high:float
    low:float

class Purchases(BaseModel):
    id:str
    stock:str
    date:datetime
    number:int
    price:float
    