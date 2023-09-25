import abc

from src import Flight
from src.utils.common import stringify_duration


class I18nClient(abc.ABC):
    @abc.abstractmethod
    def translate(self, key: str) -> str:
        pass

    @abc.abstractmethod
    def get_flight_summary_for_pilot_email_message_subject(self, flight: Flight) -> str:
        pass

    @abc.abstractmethod
    def format_flight_summary_for_pilot_email_message_template(
        self, flight: Flight, values_str: str
    ) -> str:
        pass

    def get_flight_summary_for_pilot_email_message(self, flight: Flight) -> str:
        duration_str = stringify_duration(
            start_time=flight.take_off_at, end_time=flight.landing_at
        )

        possible_values = [
            {"name": self.translate("GLIDER"), "value": flight.glider.call_sign},
            {
                "name": self.translate("TAKE_OFF_TIME"),
                "value": flight.take_off_at.strftime("%Y-%m-%d %H:%M")
                if flight.take_off_at
                else None,
            },
            {
                "name": self.translate("LANDING_TIME"),
                "value": flight.landing_at.strftime("%Y-%m-%d %H:%M")
                if flight.landing_at
                else None,
            },
            {"name": self.translate("FLIGHT_DURATION"), "value": duration_str},
            {
                "name": self.translate("PILOT_1"),
                "value": flight.pilot_1.full_name if flight.pilot_1 else None,
            },
            {
                "name": self.translate("PILOT_2"),
                "value": flight.pilot_2.full_name if flight.pilot_2 else None,
            },
            {
                "name": self.translate("FLIGHT_TYPE"),
                "value": self.translate(flight.flight_type),
            },
            {
                "name": self.translate("TOW_TYPE"),
                "value": self.translate(flight.tow_type),
            },
            {
                "name": self.translate("TOW_AIRPLANE"),
                "value": flight.tow_airplane.call_sign if flight.tow_airplane else None,
            },
            {
                "name": self.translate("TOW_PILOT"),
                "value": flight.tow_pilot.full_name if flight.tow_pilot else None,
            },
            {
                "name": self.translate("PAYERS_TYPE"),
                "value": self.translate(flight.payers_type),
            },
            {
                "name": self.translate("PAYMENT_METHOD"),
                "value": self.translate(flight.payment_method),
            },
            {
                "name": self.translate("PAYMENT_RECEIVER"),
                "value": flight.payment_receiver.full_name
                if flight.payment_receiver
                else None,
            },
            {
                "name": self.translate("PAYING_MEMBER"),
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

        return self.format_flight_summary_for_pilot_email_message_template(
            flight=flight, values_str=values_str
        )
