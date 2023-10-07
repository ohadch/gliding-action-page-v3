"""
This module implements the ActionReopenedEventHandler class.
"""

from src import Event
from src.events.handlers.event_handler import EventHandler


class ActionReopenedEventHandler(EventHandler):
    def handle(self, event: Event) -> None:
        pass
