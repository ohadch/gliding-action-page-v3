"""
This module implements the TowAirplaneActivatedEventHandler class.
"""

from src import Event
from src.events.handlers.event_handler import EventHandler


class TowAirplaneActivatedEventHandler(EventHandler):
    def handle(self, event: Event) -> None:
        pass
