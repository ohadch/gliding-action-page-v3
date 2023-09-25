from .notification_handler import NotificationHandler
from ... import Notification


class EmailNotificationHandler(NotificationHandler):
    def send_to_recipient(self, notification: Notification) -> None:
        pass
