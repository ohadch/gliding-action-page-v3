"""
This module implement a ConsoleNotificationHandler class, which is used to send notifications to the console.
It is used for debugging purposes.
"""
from src import Notification
from src.notifications.handlers.console.console_notification_handler import (
    ConsoleNotificationHandler,
)
from src.notifications.types import NotificationPayloadSchema


class FlightSummaryForPilotConsoleNotificationHandler(ConsoleNotificationHandler):
    def get_subject(self, notification: Notification) -> str:
        payload = NotificationPayloadSchema(**notification.payload)
        flight_id = payload.flight_ids[0]
        return f"Summary for flight {flight_id} of member {notification.recipient_member.email}"

    def get_message(self, notification: Notification) -> str:
        payload = NotificationPayloadSchema(**notification.payload)
        flight_id = payload.flight_ids[0]
        return f"Flight {flight_id} has landed."
