from src import Event
from src.events.handlers.action_closed_event_handler import ActionClosedEventHandler
from src.events.handlers.action_reopened_event_handler import ActionReopenedEventHandler
from src.events.handlers.event_handler import EventHandler
from src.events.handlers.field_responsible_assigned_event_handler import (
    FieldResponsibleAssignedEventHandler,
)
from src.events.handlers.field_responsible_unassigned_event_handler import (
    FieldResponsibleUnassignedEventHandler,
)
from src.events.handlers.flight_landed_event_handler import FlightLandedEventHandler
from src.events.handlers.flight_took_off_event_handler import (
    FlightTowReleasedEventHandler,
)
from src.events.handlers.flight_tow_released_event_handler import (
    FlightTookOffEventHandler,
)
from src.events.handlers.responsible_cfi_assigned_event_handler import (
    ResponsibleCfiAssignedEventHandler,
)
from src.events.handlers.responsible_cfi_unassigned_event_handler import (
    ResponsibleCfiUnassignedEventHandler,
)
from src.events.handlers.tow_airplane_activated_event_handler import (
    TowAirplaneActivatedEventHandler,
)
from src.events.handlers.tow_airplane_deactivated_event_handler import (
    TowAirplaneDeactivatedEventHandler,
)
from src.utils.enums import EventType


EVENT_NAME_TO_CLASS_MAP = {
    EventType.FLIGHT_TOOK_OFF: FlightTookOffEventHandler,
    EventType.FLIGHT_TOW_RELEASED: FlightTowReleasedEventHandler,
    EventType.FLIGHT_LANDED: FlightLandedEventHandler,
    EventType.FIELD_RESPONSIBLE_ASSIGNED: FieldResponsibleAssignedEventHandler,
    EventType.FIELD_RESPONSIBLE_UNASSIGNED: FieldResponsibleUnassignedEventHandler,
    EventType.RESPONSIBLE_CFI_ASSIGNED: ResponsibleCfiAssignedEventHandler,
    EventType.RESPONSIBLE_CFI_UNASSIGNED: ResponsibleCfiUnassignedEventHandler,
    EventType.TOW_AIRPLANE_ACTIVATED: TowAirplaneActivatedEventHandler,
    EventType.TOW_AIRPLANE_DEACTIVATED: TowAirplaneDeactivatedEventHandler,
    EventType.ACTION_CLOSED: ActionClosedEventHandler,
    EventType.ACTION_REOPENED: ActionReopenedEventHandler,
}


def event_handler_factory(event: Event) -> EventHandler:
    """
    Event handler factory
    :param event: Event
    :return: EventHandler
    """
    try:
        return EVENT_NAME_TO_CLASS_MAP[EventType(event.type)](
            event=event,
        )
    except KeyError:
        raise Exception(f"Unsupported event type: {event.type}")
