from pydantic import BaseModel
from datetime import datetime
from typing import List
from purchase.models import Purchases
from purchase.models import Wallet

class Users(BaseModel):
    _id:str
    full_name:str
    password:str
    phone:str
    email:str
    create_at:datetime
    purchases:List[Purchases]
    wallet:List[Wallet]

