from typing import Optional

from pydantic import BaseModel


class TowTypeSchema(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class TowTypeCreateSchema(BaseModel):
    name: str


class TowTypeUpdateSchema(BaseModel):
    name: Optional[str]


class TowTypeSearchSchema(TowTypeUpdateSchema):
    pass
