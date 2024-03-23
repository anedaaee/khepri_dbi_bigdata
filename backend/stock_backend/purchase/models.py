from pydantic import BaseModel
from datetime import datetime,date


class Wallet(BaseModel):
    _id:str
    stock:str
    number:int
    total_value:float
    open:float
    close:float
    high:float
    low:float

class Purchases(BaseModel):
    _id:datetime
    stock:str
    number:int
    purchaseORsale:str
    @classmethod
    def from_dict(cls, purchase_dict):
        return cls(
            id=purchase_dict["_id"],
            stock=purchase_dict["stock"],
            number=purchase_dict["number"],
        )

    def get_dict(self):
        return {
            "_id":self._id,
            "stock":self.stock,
            "number":self.number,
            "purchaseORsale":self.purchaseORsale
        }