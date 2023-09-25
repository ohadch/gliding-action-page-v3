import abc
import logging

from src import Event


class EventHandler(abc.ABC):
    def __init__(self, event: Event):
        self._event = event
        self._logger = logging.getLogger(__name__)

    @abc.abstractmethod
    def handle(self, event: Event) -> None:
        pass
