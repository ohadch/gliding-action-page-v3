from typing import Optional

from pydantic import BaseModel, ConfigDict


class PayersTypeSchema(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class PayersTypeCreateSchema(BaseModel):
    name: str


class PayersTypeUpdateSchema(BaseModel):
    name: Optional[str]


class PayersTypeSearchSchema(PayersTypeUpdateSchema):
    pass
