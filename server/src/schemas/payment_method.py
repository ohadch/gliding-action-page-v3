import datetime
from typing import Optional

from pydantic import BaseModel


class PaymentMethodSchema(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class PaymentMethodCreateSchema(BaseModel):
    name: str


class PaymentMethodUpdateSchema(BaseModel):
    name: Optional[str]
