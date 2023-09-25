from src import Notification
from src.notifications.handlers.console.console_notification_handler import (
    ConsoleNotificationHandler,
)
from src.utils.enums import NotificationType


def email_notification_handler_factory(
    notification: Notification,
) -> ConsoleNotificationHandler:
    """
    Console notification handler factory
    :param notification: The notification
    :return: Console notification handler
    """
    try:
        return {}[NotificationType(notification.type)]()
    except KeyError:
        raise ValueError(f"Invalid notification type: {notification.type}")
