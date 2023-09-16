import datetime
from typing import Optional

from pydantic import BaseModel


class FlightTypeSchema(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class FlightTypeCreateSchema(BaseModel):
    name: str


class FlightTypeUpdateSchema(BaseModel):
    name: Optional[str]


class FlightTypeSearchSchema(FlightTypeUpdateSchema):
    pass
