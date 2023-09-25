from uuid import UUID

from ..models import Event
from ..schemas import (
    EventSchema,
    EventSearchSchema,
    EventCreateSchema,
    EventUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class EventCrud(
    GenericModelCrud[
        Event,
        UUID,
        EventSchema,
        EventSearchSchema,
        EventCreateSchema,
        EventUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=Event)
