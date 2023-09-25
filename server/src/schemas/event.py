import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from src.events.types import EventPayloadSchema
from src.utils.enums import EventType, EventState


class EventSchema(BaseModel):
    id: int
    type: EventType
    state: EventState
    payload: EventPayloadSchema
    created_at: datetime.datetime
    handled_at: Optional[datetime.datetime]
    num_handling_attempts: int

    model_config = ConfigDict(from_attributes=True)


class EventCreateSchema(BaseModel):
    type: EventType
    payload: EventPayloadSchema


class EventUpdateSchema(BaseModel):
    type: Optional[EventType]
    payload: Optional[EventPayloadSchema]


class EventSearchSchema(EventUpdateSchema):
    pass