"""
This module implements the FlightTowReleasedEventHandler class.
"""

from src import Event
from src.events.handlers.event_handler import EventHandler


class FlightTowReleasedEventHandler(EventHandler):
    def handle(self, event: Event) -> None:
        pass
