from src import Flight
from src.database import SessionLocal
from src.notifications.handlers.notification_handler import NotificationHandler
from src.notifications.types import NotificationPayloadSchema


class FlightsEmailReportNotificationHandler(NotificationHandler):
    def _send_via_email(self) -> None:
        session = SessionLocal()
        notification_payload = NotificationPayloadSchema.model_validate(
            self._notification.payload
        )
        flights = session.query(Flight).filter_by(
            id__in=(notification_payload.flights_ids or [])
        )
        # subject = self._i18n.get_daily_summary_for_observer_email_message_subject(
        #     action=self._notification.action
        # )
        # message = self._i18n.get_daily_summary_for_observer_email_message(
        #     observer=self._notification.recipient_member,
        #     action=self._notification.action,
        #     flights=flights_in_action,
        # )

        self._email_client.send_email(
            to_email=self._notification.recipient_member.email,
            subject=subject,
            html_content=message,
        )

    def _send_via_console(self) -> None:
        subject = (
            f"Flights report for member {self._notification.recipient_member.email}"
        )
        message = f"Flights: {self._notification.payload['flights_ids']}"

        print(f"{subject}/{message}")
