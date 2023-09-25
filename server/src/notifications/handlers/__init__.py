import os

from src import Notification

from src.notifications.handlers.console import console_notification_handler_factory
from src.notifications.handlers.email import email_notification_handler_factory
from src.notifications.handlers.notification_handler import NotificationHandler
from src.utils.enums import NotificationMethod

DEFAULT_NOTIFICATION_METHOD = NotificationMethod(
    os.environ["DEFAULT_NOTIFICATION_METHOD"]
)


def notification_handler_factory(
    notification: Notification,
) -> NotificationHandler:
    """
    Notification handler factory
    :param notification: The notification    :return:  handler
    """
    notification_manual_method = (
        NotificationMethod(notification.method) if notification.method else None
    )
    notification_method = notification_manual_method or DEFAULT_NOTIFICATION_METHOD

    try:
        return {
            NotificationMethod.EMAIL: lambda: email_notification_handler_factory(
                notification=notification
            ),
            NotificationMethod.CONSOLE: lambda: console_notification_handler_factory(
                notification=notification
            ),
        }[notification_method]()
    except KeyError:
        raise ValueError(f"Invalid notification method: {notification_method}")
