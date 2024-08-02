from typing import Optional, List

from pydantic import BaseModel


class EventPayloadSchema(BaseModel):
    flight_id: Optional[int] = None
    field_responsible_id: Optional[int] = None
    responsible_cfi_id: Optional[int] = None
    tow_airplane_id: Optional[int] = None
    glider_id: Optional[int] = None
    tow_pilot_id: Optional[int] = None
    flights_ids: Optional[List[int]] = None
    recipient_member_id: Optional[int] = None
