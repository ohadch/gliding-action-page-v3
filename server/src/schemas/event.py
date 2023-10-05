import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from src.events.types import EventPayloadSchema
from src.utils.enums import EventType, EventState


class EventSchema(BaseModel):
    id: int
    action_id: int
    type: EventType
    state: EventState
    payload: EventPayloadSchema
    created_at: datetime.datetime
    handled_at: Optional[datetime.datetime]
    num_handling_attempts: int

    model_config = ConfigDict(from_attributes=True)


class EventCreateSchema(BaseModel):
    action_id: int
    type: EventType
    payload: EventPayloadSchema


class EventUpdateSchema(BaseModel):
    type: Optional[EventType] = None
    payload: Optional[EventPayloadSchema] = None


class EventSearchSchema(EventUpdateSchema):
    action_id: Optional[int] = None
