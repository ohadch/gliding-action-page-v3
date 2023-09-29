from typing import Optional

from pydantic import BaseModel


class NotificationPayloadSchema(BaseModel):
    flight_id: Optional[int] = None
    tow_pilot_id: Optional[int] = None
    tow_airplane_id: Optional[int] = None
