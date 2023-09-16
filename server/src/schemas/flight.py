import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class FlightSchema(BaseModel):
    id: int
    action_id: int
    take_off_at: Optional[datetime.datetime]
    landing_at: Optional[datetime.datetime]
    glider_id: Optional[int]
    pilot_1_id: Optional[int]
    pilot_2_id: Optional[int]
    tow_airplane_id: Optional[int]
    tow_pilot_id: Optional[int]
    tow_type_id: Optional[int]
    flight_type_id: Optional[int]
    payers_type_id: Optional[int]
    payment_method_id: Optional[int]
    payment_receiver_id: Optional[int]
    paying_member_id: Optional[int]
    status: str

    model_config = ConfigDict(from_attributes=True)


class FlightCreateSchema(BaseModel):
    action_id: int
    take_off_at: Optional[datetime.datetime]
    landing_at: Optional[datetime.datetime]
    glider_id: Optional[int]
    pilot_1_id: Optional[int]
    pilot_2_id: Optional[int]
    tow_airplane_id: Optional[int]
    tow_pilot_id: Optional[int]
    tow_type_id: Optional[int]
    flight_type_id: Optional[int]
    payers_type_id: Optional[int]
    payment_method_id: Optional[int]
    payment_receiver_id: Optional[int]
    paying_member_id: Optional[int]
    status: str


class FlightUpdateSchema(BaseModel):
    action_id: Optional[int]
    take_off_at: Optional[datetime.datetime]
    landing_at: Optional[datetime.datetime]
    glider_id: Optional[int]
    pilot_1_id: Optional[int]
    pilot_2_id: Optional[int]
    tow_airplane_id: Optional[int]
    tow_pilot_id: Optional[int]
    tow_type_id: Optional[int]
    flight_type_id: Optional[int]
    payers_type_id: Optional[int]
    payment_method_id: Optional[int]
    payment_receiver_id: Optional[int]
    paying_member_id: Optional[int]
    status: Optional[str]


class FlightSearchSchema(FlightUpdateSchema):
    pass
