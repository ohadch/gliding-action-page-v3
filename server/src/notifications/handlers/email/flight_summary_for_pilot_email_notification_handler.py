"""
This module implement a EmailNotificationHandler class, which is used to send notifications to the email.
It is used for debugging purposes.
"""
from src import Notification, Flight
from src.database import SessionLocal
from src.i18n import i18n_client_factory
from src.notifications.handlers.email.email_notification_handler import (
    EmailNotificationHandler,
)
from src.notifications.types import NotificationPayloadSchema


class FlightSummaryForPilotEmailNotificationHandler(EmailNotificationHandler):
    def get_subject(self, notification: Notification) -> str:
        i18n = i18n_client_factory()
        flight = self._get_flight(notification=notification)

        return i18n.get_flight_summary_for_pilot_email_message_subject(flight=flight)

    def get_message(self, notification: Notification) -> str:
        i18n = i18n_client_factory()
        flight = self._get_flight(notification=notification)
        return i18n.get_flight_summary_for_pilot_email_message(flight=flight)

    @staticmethod
    def _get_flight(notification: Notification):
        """
        Get flight from notification
        :param notification: The notification
        """
        payload = NotificationPayloadSchema(**notification.payload)
        flight_id = payload.flight_ids[0]
        session = SessionLocal()
        flight = session.query(Flight).get(flight_id)

        if not flight:
            raise ValueError(f"Invalid flight id: {flight_id}")

        if not flight.take_off_at or not flight.landing_at:
            raise ValueError(f"Flight {flight_id} is not finished yet")

        return flight
