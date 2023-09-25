from typing import List

from pydantic import BaseModel


class NotificationPayloadSchema(BaseModel):
    flight_ids: List[int]
