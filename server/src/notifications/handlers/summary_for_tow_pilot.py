from src import Notification
from src.emails.email_client import EmailClient
from src.i18n import i18n_client_factory
from src.notifications.handlers import NotificationHandler
from src.notifications.types import NotificationPayloadSchema


class FlightSummaryForPilotNotificationHandler(NotificationHandler):
    def _send_via_email(self, notification: Notification) -> None:
        email_client = EmailClient()
        i18n = i18n_client_factory()
        flight = self._get_flight(notification=notification)

        subject = i18n.get_flight_summary_for_pilot_email_message_subject(flight=flight)
        message = i18n.get_flight_summary_for_pilot_email_message(flight=flight)

    def _send_via_console(self, notification: Notification) -> None:
        payload = NotificationPayloadSchema(**notification.payload)
        flight_id = payload.flight_ids[0]

        subject = f"Summary for tow pilot"
        message = f"Flight {flight_id} has landed."

        print(f"{subject}/{message}")
