from src import Flight
from src.database import SessionLocal
from src.notifications.handlers.notification_handler import NotificationHandler


class DailySummaryForObserverNotificationHandler(NotificationHandler):
    def _send_via_email(self) -> None:
        session = SessionLocal()
        flights_in_action = session.query(Flight).filter_by(
            action_id=self._notification.action_id
        )
        subject = self._i18n.get_daily_summary_for_observer_email_message_subject(
            action=self._notification.action
        )
        message = self._i18n.get_daily_summary_for_observer_email_message(
            observer=self._notification.recipient_member,
            action=self._notification.action,
            flights=flights_in_action,
        )

        self._email_client.send_email(
            to_email=self._notification.recipient_member.email,
            subject=subject,
            html_content=message,
        )

    def _send_via_console(self) -> None:
        subject = f"Daily summary of action {self._notification.action_id} for member {self._notification.recipient_member.email}"
        message = f"Action {self._notification.action_id} has been closed."

        print(f"{subject}/{message}")
