"""
This module implements the TowAirplaneDeactivatedEventHandler class.
"""

from src import Event
from src.events.handlers.event_handler import EventHandler


class TowAirplaneDeactivatedEventHandler(EventHandler):
    def handle(self, event: Event) -> None:
        pass
