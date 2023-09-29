from typing import List

from pydantic import BaseModel


class NotificationPayloadSchema(BaseModel):
    flight_ids: List[int]
    tow_pilot_id: int
    tow_airplane_id: int
