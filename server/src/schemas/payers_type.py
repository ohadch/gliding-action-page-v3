from typing import Optional

from pydantic import BaseModel


class PayersTypeSchema(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class PayersTypeCreateSchema(BaseModel):
    name: str


class PayersTypeUpdateSchema(BaseModel):
    name: Optional[str]
