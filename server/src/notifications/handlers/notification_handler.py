import abc

from src import Notification


class NotificationHandler(abc.ABC):
    def __init__(self, notification: Notification):
        self._notification = notification

    @abc.abstractmethod
    def send_to_recipient(self, notification: Notification) -> None:
        pass
