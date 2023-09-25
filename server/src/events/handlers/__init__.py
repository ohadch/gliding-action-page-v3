from src import Event
from src.events.handlers.event_handler import EventHandler
from src.events.handlers.flight_landed_event_handler import FlightLandedEventHandler
from src.events.handlers.flight_took_off_event_handler import (
    FlightTowReleasedEventHandler,
)
from src.events.handlers.flight_tow_released_event_handler import (
    FlightTookOffEventHandler,
)
from src.utils.enums import EventType


def event_handler_factory(event: Event) -> EventHandler:
    """
    Event handler factory
    :param event: The event
    :return: The event handler
    """
    try:
        return {
            EventType.FLIGHT_TOOK_OFF: lambda: FlightTookOffEventHandler(event=event),
            EventType.FLIGHT_TOW_RELEASED: lambda: FlightTowReleasedEventHandler(
                event=event
            ),
            EventType.FLIGHT_LANDED: lambda: FlightLandedEventHandler(event=event),
        }[EventType(event.type)]()
    except KeyError:
        raise Exception(f"Unsupported event type: {event.type}")
