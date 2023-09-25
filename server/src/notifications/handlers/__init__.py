import os

from src import Notification
from src.notifications.handlers.email_notification_handler import (
    EmailNotificationHandler,
)
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

    if notification_method is NotificationMethod.EMAIL:
        return EmailNotificationHandler(notification)
    else:
        raise NotImplementedError(
            f"Notification type {notification.type} not implemented"
        )
