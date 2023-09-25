import abc

from src import Notification
from src.notifications.handlers.notification_handler import NotificationHandler


class EmailNotificationHandler(NotificationHandler):
    @abc.abstractmethod
    def get_subject(self, notification: Notification) -> str:
        pass

    @abc.abstractmethod
    def get_message(self, notification: Notification) -> str:
        pass

    def send_to_recipient(self, notification: Notification) -> None:
        raise NotImplementedError
