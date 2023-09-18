from typing import Optional

from pydantic import BaseModel, ConfigDict


class FlightTypeSchema(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class FlightTypeCreateSchema(BaseModel):
    name: str


class FlightTypeUpdateSchema(BaseModel):
    name: Optional[str] = None


class FlightTypeSearchSchema(FlightTypeUpdateSchema):
    pass
