from src import Notification
from src.notifications.handlers.flight_summary_for_pilot_notification_handler import (
    FlightSummaryForPilotNotificationHandler,
)
from src.notifications.handlers.notification_handler import NotificationHandler
from src.utils.enums import NotificationType


NOTIFICATION_NAME_TO_CLASS_MAP = {
    NotificationType.FlightSummaryForPilot: FlightSummaryForPilotNotificationHandler,
}


def notification_handler_factory(notification: Notification) -> NotificationHandler:
    """
    Notification handler factory
    :param notification: Notification
    :return: NotificationHandler
    """
    try:
        return NOTIFICATION_NAME_TO_CLASS_MAP[NotificationType(notification.type)](
            notification=notification,
        )
    except KeyError:
        raise ValueError(f"Unsupported notification type: {notification.type}")
