"""
This module implement a ConsoleNotificationHandler class, which is used to send notifications to the console.
It is used for debugging purposes.
"""
import abc

from src import Notification
from src.notifications.handlers.notification_handler import NotificationHandler


class ConsoleNotificationHandler(NotificationHandler, abc.ABC):
    @abc.abstractmethod
    def get_subject(self, notification: Notification) -> str:
        pass

    @abc.abstractmethod
    def get_message(self, notification: Notification) -> str:
        pass

    def send_to_recipient(self, notification: Notification) -> None:
        subject = self.get_subject(notification=notification)
        message = self.get_message(notification=notification)
        print(
            f"Console notification for {notification.recipient_member.email}: {subject}/{message}"
        )
