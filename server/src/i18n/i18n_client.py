import abc
import datetime
from typing import List, Optional, Tuple

import pandas as pd

from src import Flight, Member, Action, TowAirplane
from src.utils.common import stringify_duration
from itertools import groupby


class I18nClient(abc.ABC):
    @abc.abstractmethod
    def translate(self, key: str) -> str:
        pass

    @abc.abstractmethod
    def get_flight_summary_for_pilot_email_message_subject(self, flight: Flight) -> str:
        pass

    @abc.abstractmethod
    def get_summary_for_tow_pilot_email_message_subject(
        self,
        tow_pilot: Member,
        tow_airplane: TowAirplane,
        action: Action,
        flights: List[Flight],
    ) -> str:
        pass

    @abc.abstractmethod
    def get_flights_email_report_email_message_subject(
        self, flights: List[Flight]
    ) -> str:
        pass

    @abc.abstractmethod
    def get_daily_summary_for_observer_email_message_subject(
        self,
        action: Action,
    ) -> str:
        pass

    @abc.abstractmethod
    def format_flight_summary_for_pilot_email_message_template(
        self,
        member: Member,
        flight: Flight,
        flight_details_html: str,
        flights_by_glider: List[Tuple[str, int, str, str]],
    ) -> str:
        pass

    @abc.abstractmethod
    def format_summary_for_tow_pilot_email_message_template(
        self,
        tow_pilot: Member,
        tow_airplane: TowAirplane,
        action: Action,
        flights: List[Flight],
        html: str,
    ) -> str:
        pass

    @abc.abstractmethod
    def format_daily_summary_for_observer_email_message_template(
        self,
        observer: Member,
        action: Action,
        flights: List[Flight],
        flights_by_glider: List[Tuple[str, int, str, str]],
    ) -> str:
        pass

    @abc.abstractmethod
    def format_flights_email_report_email_message_template(
        self,
        member: Member,
        action: Action,
        flights: List[Flight],
        flights_metadata_html: str,
        flights_table_html: str,
    ) -> str:
        pass

    def get_daily_summary_for_observer_email_message(
        self,
        observer: Member,
        action: Action,
        flights: List[Flight],
    ) -> str:
        flights_by_glider: List[
            Tuple[str, int, str, str]
        ] = self._group_flights_by_glider(flights=flights)

        return self.format_daily_summary_for_observer_email_message_template(
            observer=observer,
            action=action,
            flights=flights,
            flights_by_glider=flights_by_glider,
        )

    def get_flight_summary_for_pilot_email_message(
        self, member: Member, flight: Flight, flights_in_action: List[Flight]
    ) -> str:
        duration_str = stringify_duration(
            total_duration=flight.landing_at - flight.take_off_at
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

        flight_details_html = "\n".join(
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

        flights_by_glider: List[
            Tuple[str, int, str, str]
        ] = self._group_flights_by_glider(flights=flights_in_action)

        return self.format_flight_summary_for_pilot_email_message_template(
            member=member,
            flight=flight,
            flight_details_html=flight_details_html,
            flights_by_glider=flights_by_glider,
        )

    def get_summary_for_tow_pilot_email_message(
        self,
        tow_pilot: Member,
        tow_airplane: TowAirplane,
        action: Action,
        flights: List[Flight],
    ) -> str:
        """
        Get summary for tow pilot email message
        :param tow_pilot: tow pilot
        :param tow_airplane: tow airplane
        :param action: action
        :param flights: flights
        """
        flights_table_html = self._create_flights_table_html(
            flights=flights,
            headers=[
                "take_off_at",
                "airplane",
                "tow_type",
                "glider",
                "pilot1",
                "pilot2",
            ],
        )

        return self.format_summary_for_tow_pilot_email_message_template(
            tow_pilot=tow_pilot,
            tow_airplane=tow_airplane,
            action=action,
            flights=flights,
            html=flights_table_html,
        )

    def get_flights_email_report_email_message(
        self, member: Member, action: Action, flights: List[Flight]
    ) -> str:
        """
        Get flights email report email message
        :param member: member
        :param action: action
        :param flights: flights
        """
        flights_table_html = self._create_flights_table_html(
            flights=flights,
            headers=[
                "take_off_at",
                "landing_at",
                "glider",
                "pilot_1",
                "pilot_2",
                "tow_pilot",
                "airplane",
                "flight_type",
                "tow_type",
                "payers_type",
                "payment_method",
                "payment_receiver",
                "flight_duration",
            ],
        )

        flights_metadata_html = self._create_flights_metadata_section_html(
            flights=flights
        )

        return self.format_flights_email_report_email_message_template(
            member=member,
            action=action,
            flights=flights,
            flights_metadata_html=flights_metadata_html,
            flights_table_html=flights_table_html,
        )

    def _group_flights_by_glider(
        self, flights: List[Flight]
    ) -> List[Tuple[str, int, str, str]]:
        """
        Group flights by glider
        :param flights: flights
        :return: Lost of tuples (glider_call_sign, number_of_flights, total_duration_string, flights_table_html)
        """
        flights_by_glider: List[Tuple[str, int, str, str]] = []

        # Include only flights that have both take_off_at and landing_at
        flights = [
            flight for flight in flights if flight.take_off_at and flight.landing_at
        ]

        # For each glider, calculate the number and total duration of all flights
        for glider_call_sign, glider_flights in groupby(
            sorted(flights, key=lambda flight_: flight_.take_off_at),
            lambda f: f.glider.call_sign,
        ):
            glider_flights = list(glider_flights)

            # Calculate the total duration of all flights
            total_duration = sum(
                [
                    (flight.landing_at - flight.take_off_at).total_seconds()
                    for flight in glider_flights
                ]
            )

            # Convert the total duration to a string
            glider_flights_duration = stringify_duration(
                total_duration=datetime.timedelta(seconds=total_duration)
            )

            flights_by_glider.append(
                (
                    glider_call_sign,
                    len(glider_flights),
                    glider_flights_duration,
                    self._create_flights_table_html(
                        flights=glider_flights,
                    ),
                )
            )

        return flights_by_glider

    def _create_flights_table_html(
        self, flights: List[Flight], headers: Optional[List[str]] = None
    ) -> str:
        # Convert the list of Flight objects into a DataFrame
        df = pd.DataFrame(
            [
                {
                    "take_off_at": flight.take_off_at,
                    "landing_at": flight.landing_at,
                    "glider": flight.glider.call_sign,
                    "pilot_1": flight.pilot_1.full_name if flight.pilot_1 else None,
                    "pilot_2": flight.pilot_2.full_name if flight.pilot_2 else None,
                    "tow_pilot": flight.tow_pilot.full_name
                    if flight.tow_pilot
                    else None,
                    "airplane": flight.tow_airplane.call_sign
                    if flight.tow_airplane
                    else None,
                    "flight_type": self.translate(flight.flight_type),
                    "tow_type": self.translate(flight.tow_type),
                    "payers_type": self.translate(flight.payers_type),
                    "payment_method": self.translate(flight.payment_method),
                    "payment_receiver": flight.payment_receiver.full_name
                    if flight.payment_receiver
                    else None,
                    "flight_duration": stringify_duration(
                        total_duration=flight.landing_at - flight.take_off_at
                    ),
                }
                for flight in flights
                if flight.take_off_at and flight.landing_at
            ]
        )

        # Sort the DataFrame by the 'take_off_at' column
        df = df.sort_values(by=["take_off_at"])

        # Format date-time columns
        date_time_columns = [
            col for col in ["take_off_at", "landing_at"] if col in df.columns
        ]
        df[date_time_columns] = df[date_time_columns].apply(
            lambda x: x.dt.strftime("%H:%M:%S") if not x.isna().any() else None
        )

        if headers:
            df = df[[h for h in headers if h in df.columns]]

        # Customize column names
        column_names = {
            "take_off_at": self.translate("TAKE_OFF_TIME"),
            "landing_at": self.translate("LANDING_TIME"),
            "glider": self.translate("GLIDER"),
            "pilot_1": self.translate("PILOT_1"),
            "pilot_2": self.translate("PILOT_2"),
            "tow_pilot": self.translate("TOW_PILOT"),
            "airplane": self.translate("TOW_AIRPLANE"),
            "flight_type": self.translate("FLIGHT_TYPE"),
            "tow_type": self.translate("TOW_TYPE"),
            "payers_type": self.translate("PAYERS_TYPE"),
            "payment_method": self.translate("PAYMENT_METHOD"),
            "payment_receiver": self.translate("PAYMENT_RECEIVER"),
            "flight_duration": self.translate("FLIGHT_DURATION"),
        }

        if headers:
            df = df[[h for h in headers if h in df.columns]]

        # Drop na columns
        df = df.dropna(axis=1, how="all")

        # Rename DataFrame columns
        df = df.rename(columns=column_names)

        # Convert the DataFrame to an HTML table
        html_table = df.to_html(
            index=False, escape=False, classes="table table-bordered table-hover"
        )

        return html_table

    def _create_flights_metadata_section_html(self, flights: List[Flight]) -> str:
        # The metadata section shows the number of flights and total duration
        num_flights = len(flights)
        total_duration = sum(
            [
                (flight.landing_at - flight.take_off_at).total_seconds()
                for flight in flights
            ]
        )

        # Convert the total duration to a string
        total_duration_str = stringify_duration(
            total_duration=datetime.timedelta(seconds=total_duration)
        )

        # Create the metadata section
        metadata_section = f"""
            <div>
                <strong>{self.translate("FLIGHTS_NUMBER")}:</strong> {num_flights}
            </div>
            <div>
                <strong>{self.translate("TOTAL_DURATION")}:</strong> {total_duration_str}
            </div>
        """

        return metadata_section
