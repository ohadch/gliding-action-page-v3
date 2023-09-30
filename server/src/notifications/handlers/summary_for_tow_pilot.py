from src import Member, TowAirplane, Action, Flight
from src.notifications.handlers.notification_handler import NotificationHandler


class SummaryForTowPilotNotificationHandler(NotificationHandler):
    def _send_via_email(self) -> None:
        tow_pilot, tow_airplane, action, flights = self._get_properties()

        subject = self._i18n.get_summary_for_tow_pilot_email_message_subject(
            tow_pilot=tow_pilot,
            tow_airplane=tow_airplane,
            action=action,
            flights=flights,
        )

        message = self._i18n.get_summary_for_tow_pilot_email_message(
            tow_pilot=tow_pilot,
            tow_airplane=tow_airplane,
            action=action,
            flights=flights,
        )

        self._email_client.send_email(
            to_email=tow_pilot.email,
            subject=subject,
            html_content=message,
        )

    def _send_via_console(self) -> None:
        tow_pilot, tow_airplane, action, flights = self._get_properties()

        subject = f"Tow summary for {tow_pilot.full_name} on {action.date}"
        message = f"{tow_pilot.full_name} has towed {len(flights)} flights with {tow_airplane.call_sign}"

        print(f"{subject}/{message}")

    def _get_properties(self):
        tow_airplane_id = self._payload.tow_airplane_id
        if not tow_airplane_id:
            raise ValueError("Tow airplane id is required")

        tow_pilot_id = self._payload.tow_pilot_id
        if not tow_pilot_id:
            raise ValueError("Tow pilot id is required")

        action_id = self._notification.action_id

        tow_pilot = self._session.query(Member).get(tow_pilot_id)
        tow_airplane = self._session.query(TowAirplane).get(tow_airplane_id)
        action = self._session.query(Action).get(action_id)
        flights = (
            self._session.query(Flight)
            .filter_by(
                tow_pilot_id=tow_pilot.id,
                tow_airplane_id=tow_airplane.id,
                action_id=action.id,
            )
            .all()
        )

        return tow_pilot, tow_airplane, action, flights
