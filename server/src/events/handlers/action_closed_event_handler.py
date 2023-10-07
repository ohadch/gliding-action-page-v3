"""
This module implements the ActionClosedEventHandler class.
"""

from src import Event
from src.events.handlers.event_handler import EventHandler


class ActionClosedEventHandler(EventHandler):
    def handle(self, event: Event) -> None:
        pass
