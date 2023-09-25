from src import Notification
from src.notifications.handlers.email.email_notification_handler import (
    EmailNotificationHandler,
)
from src.notifications.handlers.email.flight_summary_for_pilot_email_notification_handler import (
    FlightSummaryForPilotEmailNotificationHandler,
)
from src.utils.enums import NotificationType


def email_notification_handler_factory(
    notification: Notification,
) -> EmailNotificationHandler:
    """
    Email notification handler factory
    :param notification: The notification
    :return: Email notification handler
    """
    try:
        return {
            NotificationType.FlightSummaryForPilot: lambda: FlightSummaryForPilotEmailNotificationHandler(
                notification=notification
            ),
        }[NotificationType(notification.type)]()
    except KeyError:
        raise ValueError(f"Invalid notification type: {notification.type}")
