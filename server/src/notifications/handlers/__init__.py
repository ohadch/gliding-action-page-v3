from src import Notification
from src.notifications.handlers.daily_summary_for_observer_notification_handler import (
    DailySummaryForObserverNotificationHandler,
)
from src.notifications.handlers.flight_summary_for_pilot_notification_handler import (
    FlightSummaryForPilotNotificationHandler,
)
from src.notifications.handlers.flights_email_report_notification_handler import (
    FlightsEmailReportNotificationHandler,
)
from src.notifications.handlers.notification_handler import NotificationHandler
from src.notifications.handlers.summary_for_tow_pilot import (
    SummaryForTowPilotNotificationHandler,
)
from src.utils.enums import NotificationType


NOTIFICATION_NAME_TO_CLASS_MAP = {
    NotificationType.FlightSummaryForPilot: FlightSummaryForPilotNotificationHandler,
    NotificationType.SummaryForTowPilot: SummaryForTowPilotNotificationHandler,
    NotificationType.DailySummaryForObserver: DailySummaryForObserverNotificationHandler,
    NotificationType.FlightsEmailReport: FlightsEmailReportNotificationHandler,
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
