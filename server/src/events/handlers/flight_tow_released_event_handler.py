"""
This module implements the FlightTookOffEventHandler class.
"""

from src import Event
from src.events.handlers.event_handler import EventHandler


class FlightTookOffEventHandler(EventHandler):
    def handle(self, event: Event) -> None:
        pass
