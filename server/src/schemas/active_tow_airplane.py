from typing import Optional

from pydantic import BaseModel, ConfigDict


class ActiveTowAirplaneSchema(BaseModel):
    id: int
    action_id: int
    tow_pilot_id: int
    airplane_id: int

    model_config = ConfigDict(from_attributes=True)


class ActiveTowAirplaneCreateSchema(BaseModel):
    action_id: int
    tow_pilot_id: int
    airplane_id: int


class ActiveTowAirplaneUpdateSchema(BaseModel):
    action_id: Optional[int]
    tow_pilot_id: Optional[int]
    airplane_id: Optional[int]


class ActiveTowAirplaneSearchSchema(ActiveTowAirplaneUpdateSchema):
    pass
