from src import Flight
from src.database import SessionLocal
from src.notifications.handlers.notification_handler import NotificationHandler


class FlightSummaryForPilotNotificationHandler(NotificationHandler):
    def _send_via_email(self) -> None:
        flight = self._get_flight()
        session = SessionLocal()
        member = self._notification.recipient_member
        flights_in_action = session.query(Flight).filter(
            (Flight.action_id == flight.action_id)
            & ((Flight.pilot_1 == member) | (Flight.pilot_2 == member))
        )

        subject = self._i18n.get_flight_summary_for_pilot_email_message_subject(
            flight=flight
        )
        message = self._i18n.get_flight_summary_for_pilot_email_message(
            member=member, flight=flight, flights_in_action=flights_in_action
        )

        self._email_client.send_email(
            to_email=self._notification.recipient_member.email,
            subject=subject,
            html_content=message,
        )

    def _send_via_console(self) -> None:
        flight_id = self._payload.flight_id

        subject = f"Summary for flight {flight_id} of member {self._notification.recipient_member.email}"
        message = f"Flight {flight_id} has landed."

        print(f"{subject}/{message}")

    def _get_flight(self) -> Flight:
        """
        Get flight from notification
        """
        flight_id = self._payload.flight_id
        session = SessionLocal()
        flight = session.query(Flight).get(flight_id)

        if not flight:
            raise ValueError(f"Invalid flight id: {flight_id}")

        if not flight.take_off_at or not flight.landing_at:
            raise ValueError(f"Flight {flight_id} is not finished yet")

        return flight
