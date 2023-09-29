from typing import Optional

from pydantic import BaseModel, ConfigDict


class TowAirplaneSchema(BaseModel):
    id: int
    call_sign: str

    model_config = ConfigDict(from_attributes=True)


class TowAirplaneCreateSchema(BaseModel):
    call_sign: str


class TowAirplaneUpdateSchema(BaseModel):
    call_sign: Optional[str] = None


class TowAirplaneSearchSchema(TowAirplaneUpdateSchema):
    pass
