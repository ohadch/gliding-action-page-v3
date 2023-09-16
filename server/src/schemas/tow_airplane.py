from typing import Optional

from pydantic import BaseModel, ConfigDict


class TowAirplaneSchema(BaseModel):
    id: int
    call_sign: str
    type: int

    model_config = ConfigDict(from_attributes=True)


class TowAirplaneCreateSchema(BaseModel):
    call_sign: str
    type: int


class TowAirplaneUpdateSchema(BaseModel):
    call_sign: Optional[str]
    type: Optional[int]


class TowAirplaneSearchSchema(TowAirplaneUpdateSchema):
    pass
