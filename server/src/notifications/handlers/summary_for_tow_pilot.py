from src import Notification, Member, TowAirplane, Action, Flight
from src.database import SessionLocal
from src.emails.email_client import EmailClient
from src.i18n import i18n_client_factory
from src.notifications.handlers.notification_handler import NotificationHandler


class SummaryForTowPilotNotificationHandler(NotificationHandler):
    def _send_via_email(self, notification: Notification) -> None:
        session = SessionLocal()
        email_client = EmailClient()
        i18n = i18n_client_factory()

        tow_airplane_id = self._payload.tow_airplane_id
        if not tow_airplane_id:
            raise ValueError("Tow airplane id is required")

        tow_pilot_id = self._payload.tow_pilot_id
        if not tow_pilot_id:
            raise ValueError("Tow pilot id is required")

        action_id = notification.action_id

        tow_pilot = session.query(Member).get(tow_pilot_id)
        tow_airplane = session.query(TowAirplane).get(tow_airplane_id)
        action = session.query(Action).get(action_id)
        flights = (
            session.query(Flight)
            .filter_by(
                tow_pilot_id=tow_pilot.id,
                tow_airplane_id=tow_airplane.id,
                action_id=action.id,
            )
            .all()
        )

        if not flights:
            self._logger.info(
                f"No flights for tow pilot {tow_pilot.id} on {action.date}, not sending email"
            )
            return

        subject = i18n.get_summary_for_tow_pilot_email_message_subject(
            tow_pilot=tow_pilot,
            tow_airplane=tow_airplane,
            action=action,
            flights=flights,
        )

        message = i18n.get_summary_for_tow_pilot_email_message(
            tow_pilot=tow_pilot,
            tow_airplane=tow_airplane,
            action=action,
            flights=flights,
        )

        email_client.send_email(
            to_email=tow_pilot.email,
            subject=subject,
            html_content=message,
        )

    def _send_via_console(self, notification: Notification) -> None:
        session = SessionLocal()
        email_client = EmailClient()
        i18n = i18n_client_factory()

        tow_airplane_id = self._payload.tow_airplane_id
        if not tow_airplane_id:
            raise ValueError("Tow airplane id is required")

        tow_pilot_id = self._payload.tow_pilot_id
        if not tow_pilot_id:
            raise ValueError("Tow pilot id is required")

        action_id = notification.action_id

        tow_pilot = session.query(Member).get(tow_pilot_id)
        tow_airplane = session.query(TowAirplane).get(tow_airplane_id)
        action = session.query(Action).get(action_id)
        flights = (
            session.query(Flight)
            .filter_by(
                tow_pilot_id=tow_pilot.id,
                tow_airplane_id=tow_airplane.id,
                action_id=action.id,
            )
            .all()
        )

        subject = f"Tow summary for {tow_pilot.full_name} on {action.date}"
        message = f"{tow_pilot.full_name} has towed {len(flights)} flights with {tow_airplane.call_sign}"

        print(f"{subject}/{message}")
