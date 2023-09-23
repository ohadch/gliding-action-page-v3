import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from src.utils.enums import FlightType, PayersType, PaymentMethod, TowType


class FlightSchema(BaseModel):
    id: int
    action_id: int
    take_off_at: Optional[datetime.datetime]
    landing_at: Optional[datetime.datetime]
    glider_id: Optional[int] = None
    pilot_1_id: Optional[int] = None
    pilot_2_id: Optional[int] = None
    tow_airplane_id: Optional[int] = None
    tow_pilot_id: Optional[int] = None
    tow_type: Optional[TowType] = None
    flight_type: Optional[FlightType] = None
    payers_type: Optional[PayersType] = None
    payment_method: Optional[PaymentMethod] = None
    payment_receiver_id: Optional[int] = None
    paying_member_id: Optional[int] = None
    status: str

    model_config = ConfigDict(from_attributes=True)


class FlightCreateSchema(BaseModel):
    action_id: int
    take_off_at: Optional[datetime.datetime] = None
    landing_at: Optional[datetime.datetime] = None
    glider_id: Optional[int] = None
    pilot_1_id: Optional[int] = None
    pilot_2_id: Optional[int] = None
    tow_airplane_id: Optional[int] = None
    tow_pilot_id: Optional[int] = None
    tow_type: Optional[TowType] = None
    flight_type: Optional[FlightType] = None
    payers_type: Optional[PayersType] = None
    payment_method: Optional[PaymentMethod] = None
    payment_receiver_id: Optional[int] = None
    paying_member_id: Optional[int] = None
    status: str


class FlightUpdateSchema(BaseModel):
    action_id: Optional[int] = None
    take_off_at: Optional[datetime.datetime] = None
    landing_at: Optional[datetime.datetime] = None
    glider_id: Optional[int] = None
    pilot_1_id: Optional[int] = None
    pilot_2_id: Optional[int] = None
    tow_airplane_id: Optional[int] = None
    tow_pilot_id: Optional[int] = None
    tow_type: Optional[TowType] = None
    flight_type: Optional[FlightType] = None
    payers_type: Optional[PayersType] = None
    payment_method: Optional[PaymentMethod] = None
    payment_receiver_id: Optional[int] = None
    paying_member_id: Optional[int] = None
    status: Optional[str] = None


class FlightSearchSchema(FlightUpdateSchema):
    pass
