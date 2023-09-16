from typing import Optional

from pydantic import BaseModel, ConfigDict


class PaymentMethodSchema(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class PaymentMethodCreateSchema(BaseModel):
    name: str


class PaymentMethodUpdateSchema(BaseModel):
    name: Optional[str] = None


class PaymentMethodSearchSchema(PaymentMethodUpdateSchema):
    pass
