from pydantic import BaseModel
from datetime import datetime
from typing import List
from purchase.models import Purchases
from purchase.models import Wallet

class Users(BaseModel):
    id:str
    full_name:str
    password:str
    phone:str
    email:str
    create_at:datetime
    purchases:List[Purchases]
    wallet:List[Wallet]

    @classmethod
    def from_dict(cls, user_dict):
        return cls(
            id=user_dict["_id"],
            full_name=user_dict["full_name"],
            password=user_dict["password"],
            phone=user_dict["phone"],
            email=user_dict["email"],
            create_at=user_dict["create_at"],
            purchases=user_dict["purchases"],
            wallet=user_dict["wallet"]
        )
