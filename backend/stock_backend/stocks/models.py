from pydantic import BaseModel
from datetime import date
from typing import List

class StockHistory(BaseModel):
    id:str
    date:date
    open:float
    close:float
    high:float
    low:float
    volume:int
    
class Stock(BaseModel):
    id:str
    date:date
    open:float
    close:float
    high:float
    low:float
    volume:int
    history:List[StockHistory]
    
