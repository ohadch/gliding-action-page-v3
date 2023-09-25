from typing import Optional

from pydantic import BaseModel


class EventPayloadSchema(BaseModel):
    flight_id: Optional[int] = None
    action_id: Optional[int] = None
