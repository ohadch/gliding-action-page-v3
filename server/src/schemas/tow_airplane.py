from typing import Optional

from pydantic import BaseModel


class TowAirplaneSchema(BaseModel):
    id: int
    call_sign: str
    type: int

    class Config:
        orm_mode = True


class TowAirplaneCreateSchema(BaseModel):
    call_sign: str
    type: int


class TowAirplaneUpdateSchema(BaseModel):
    call_sign: Optional[str]
    type: Optional[int]


class TowAirplaneSearchSchema(TowAirplaneUpdateSchema):
    pass
