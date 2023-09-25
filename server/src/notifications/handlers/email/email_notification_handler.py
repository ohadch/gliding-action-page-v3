import abc

from src import Notification
from src.emails.email_client import EmailClient
from src.notifications.handlers.notification_handler import NotificationHandler


class EmailNotificationHandler(NotificationHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._client = EmailClient()

    @abc.abstractmethod
    def get_subject(self, notification: Notification) -> str:
        pass

    @abc.abstractmethod
    def get_message(self, notification: Notification) -> str:
        pass

    def send_to_recipient(self, notification: Notification) -> None:
        self._client.send_email(
            to_email=notification.recipient_member.email,
            subject=self.get_subject(notification=notification),
            html_content=self.get_message(notification=notification),
        )
