import abc

from src import Event


class EventHandler(abc.ABC):
    def __init__(self, event: Event):
        self._event = event

    @abc.abstractmethod
    def handle(self, event: Event) -> None:
        pass
