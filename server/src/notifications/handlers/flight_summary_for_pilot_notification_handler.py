from src import Notification, Flight
from src.database import SessionLocal
from src.emails.email_client import EmailClient
from src.i18n import i18n_client_factory
from src.notifications.handlers.notification_handler import NotificationHandler
from src.notifications.types import NotificationPayloadSchema


class FlightSummaryForPilotNotificationHandler(NotificationHandler):
    def _send_via_email(self, notification: Notification) -> None:
        email_client = EmailClient()
        i18n = i18n_client_factory()
        flight = self._get_flight(notification=notification)

        subject = i18n.get_flight_summary_for_pilot_email_message_subject(flight=flight)
        message = i18n.get_flight_summary_for_pilot_email_message(flight=flight)

        email_client.send_email(
            to_email=notification.recipient_member.email,
            subject=subject,
            html_content=message,
        )

    def _send_via_console(self, notification: Notification) -> None:
        payload = NotificationPayloadSchema(**notification.payload)
        flight_id = payload.flight_id

        subject = f"Summary for flight {flight_id} of member {notification.recipient_member.email}"
        message = f"Flight {flight_id} has landed."

        print(f"{subject}/{message}")

    def _get_flight(self, notification: Notification):
        """
        Get flight from notification
        :param notification: The notification
        """
        flight_id = self._payload.flight_id
        session = SessionLocal()
        flight = session.query(Flight).get(flight_id)

        if not flight:
            raise ValueError(f"Invalid flight id: {flight_id}")

        if not flight.take_off_at or not flight.landing_at:
            raise ValueError(f"Flight {flight_id} is not finished yet")

        return flight
