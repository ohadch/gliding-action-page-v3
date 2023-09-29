import abc
from typing import List, Dict, Any

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
    def get_summary_for_tow_pilot_email_message_subject(self, flight: Flight) -> str:
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

    def create_flights_table_html(self, flights: List[Flight]):
        headers = {
            "take_off_at": self.translate("take_off_at"),
            "landing_at": self.translate("landing_at"),
            "glider": self.translate("glider"),
            "pilot1": self.translate("pilot1"),
            "pilot2": self.translate("pilot2"),
            "tow_pilot": self.translate("tow_pilot"),
            "airplane": self.translate("airplane"),
            "flight_type": self.translate("flight_type"),
            "tow_type": self.translate("tow_type"),
            "payers_type": self.translate("payers_type"),
            "payment_method": self.translate("payment_method"),
            "payment_receiver": self.translate("payment_receiver"),
            "duration": self.translate("duration"),
        }

        items = [
            {
                "take_off_at": flight.take_off_at.strftime("%H:%M:%S")
                if flight.takeOffAt
                else None,
                "landing_at": flight.landing_at.strftime("%H:%M:%S")
                if flight.landingAt
                else None,
                "glider": flight.glider.call_sign if flight.glider else None,
                "pilot1": flight.pilot_1.full_name if flight.pilot_1 else None,
                "pilot2": flight.pilot_2.full_name if flight.pilot_2 else None,
                "tow_pilot": flight.tow_pilot.full_name if flight.tow_pilot else None,
                "airplane": flight.tow_airplane.call_sign if flight.airplane else None,
                "flight_type": self.translate(flight.flight_type),
                "tow_type": self.translate(flight.tow_type),
                "payers_type": self.translate(flight.payers_type),
                "payment_method": self.translate(flight.payment_method),
                "payment_receiver": flight.payment_receiver.full_name
                if flight.payment_receiver
                else None,
                "duration": stringify_duration(
                    start_time=flight.take_off_at, end_time=flight.landing_at
                ),
            }
            for flight in sorted(
                flights, key=lambda f: f.takeOffAt if f.takeOffAt else ""
            )
        ]

        return self.create_table_from_json_array(
            headers=headers,
            items=items,
        )

    @staticmethod
    def create_table_from_json_array(
        headers: Dict[str, str], items: List[Dict[str, Any]]
    ):
        if len(headers) == 0:
            raise ValueError("headers must not be empty")

        headers_str = "".join(
            [f"<th>{display_name}</th>" for display_name in headers.values()]
        )

        items_str = "".join(
            [
                f'''<tr>{"".join([f"""<td>{item.get(key, "")}</td>""" for key in headers])}</tr>'''
                for item in items
            ]
        )

        return f"""
            <table border="1" style="border-collapse: collapse;">
                <thead>
                    <tr>{headers_str}</tr>
                </thead>
                <tbody>
                    {items_str}
                </tbody>
            </table>
        """
