"""
This module implement a EmailNotificationHandler class, which is used to send notifications to the email.
It is used for debugging purposes.
"""
from src import Notification, Flight
from src.database import SessionLocal
from src.notifications.handlers.email.email_notification_handler import (
    EmailNotificationHandler,
)
from src.notifications.types import NotificationPayloadSchema
from src.utils.common import stringify_duration


class FlightSummaryForPilotEmailNotificationHandler(EmailNotificationHandler):
    def get_subject(self, notification: Notification) -> str:
        flight = self._get_flight(notification=notification)

        duration_str = stringify_duration(
            start_time=flight.take_off_at, end_time=flight.landing_at
        )

        return f"טיסתך בדאון {flight.glider.call_sign} נמשכה {duration_str} שעות"

    def get_message(self, notification: Notification) -> str:
        flight = self._get_flight(notification=notification)

        duration_str = stringify_duration(
            start_time=flight.take_off_at, end_time=flight.landing_at
        )

        possible_values = [
            {"name": "דאון", "value": flight.glider.call_sign},
            {
                "name": "שעת ההמראה",
                "value": flight.take_off_at.strftime("%Y-%m-%d %H:%M")
                if flight.take_off_at
                else None,
            },
            {
                "name": "שעת הנחיתה",
                "value": flight.landing_at.strftime("%Y-%m-%d %H:%M")
                if flight.landing_at
                else None,
            },
            {"name": "משך הטיסה", "value": duration_str},
            {
                "name": "טייס 1 או חניך",
                "value": flight.pilot_1.full_name if flight.pilot_1 else None,
            },
            {
                "name": "טייס 2 או מדריך",
                "value": flight.pilot_2.full_name if flight.pilot_2 else None,
            },
            {"name": "סוג הטיסה", "value": flight.flight_type},
            {"name": "גובה הגרירה", "value": flight.tow_type},
            {
                "name": "המטוס הגורר",
                "value": flight.tow_airplane.call_sign if flight.tow_airplane else None,
            },
            {
                "name": "הטייס הגורר",
                "value": flight.tow_pilot.full_name if flight.tow_pilot else None,
            },
            {"name": "זהות המשלם", "value": flight.payers_type},
            {"name": "אופן התשלום", "value": flight.payment_method},
            {
                "name": "מקבל התשלום",
                "value": flight.payment_receiver.full_name
                if flight.payment_receiver
                else None,
            },
            {
                "name": "החבר המשלם",
                "value": flight.paying_member.full_name
                if flight.paying_member
                else None,
            },
        ]

        values_str = "\n".join(
            [
                f"""
            <tr>
                <strong>{entry['name']}:</strong>
                {entry['value']}
            </tr>
            """
                for entry in possible_values
                if entry["value"]
            ]
        )

        html = f"""
            <table>
                <tr>שלום,</tr>
                <tr></tr>
                <tr>מצורף סיכום לטיסתך מתאריך {flight.take_off_at.strftime('%Y-%m-%d')}.</tr>
                <tr></tr>
                {values_str}
                <tr></tr>
                <tr>מקווים שנהנית,</tr>
                <tr>מרכז הדאיה מגידו</tr>
            </table>
        """

        return html

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
