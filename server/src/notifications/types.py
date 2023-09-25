from typing import List

from pydantic import BaseModel


class NotificationConfigSchema(BaseModel):
    flight_ids: List[int]
