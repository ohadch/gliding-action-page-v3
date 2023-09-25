from .notification_handler import NotificationHandler
from ... import Notification


class ConsoleNotificationHandler(NotificationHandler):
    def send_to_recipient(self, notification: Notification) -> None:
        print(
            f"ConsoleNotificationHandler: {notification.id}, would have sent to {notification.recipient_member.email}"
        )
