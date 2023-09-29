"""
This module implements the ResponsibleCfiUnassignedEventHandler class.
"""

from src import Event
from src.events.handlers.event_handler import EventHandler


class ResponsibleCfiUnassignedEventHandler(EventHandler):
    def handle(self, event: Event) -> None:
        pass
