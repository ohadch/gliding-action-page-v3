import datetime
from typing import List, Tuple, Optional
from unittest.mock import MagicMock

from src import Member, Action, Flight, TowAirplane
from src.i18n import I18nClient


class MockI18nClient(I18nClient):
    def translate(self, key: str) -> str:
        pass

    def get_flight_summary_for_pilot_email_message_subject(self, flight: Flight) -> str:
        pass

    def get_summary_for_tow_pilot_email_message_subject(
        self,
        tow_pilot: Member,
        tow_airplane: TowAirplane,
        action: Action,
        flights: List[Flight],
    ) -> str:
        pass

    def format_flight_summary_for_pilot_email_message_template(
        self,
        member: Member,
        flight: Flight,
        flight_details_html: str,
        flights_by_glider: List[Tuple[str, int, str, str]],
    ) -> str:
        pass

    def format_summary_for_tow_pilot_email_message_template(
        self,
        tow_pilot: Member,
        tow_airplane: TowAirplane,
        action: Action,
        flights: List[Flight],
        html: str,
    ) -> str:
        pass

    def get_daily_summary_for_observer_email_message_subject(
        self, action: Action
    ) -> str:
        pass

    def format_daily_summary_for_observer_email_message_template(
        self,
        observer: Member,
        action: Action,
        flights: List[Flight],
        flights_by_glider: List[Tuple[str, int, str, str]],
    ) -> str:
        pass

    def create_flights_table_html(
        self, flights: List[Flight], headers: Optional[List[str]] = None
    ) -> str:
        return "test"


class TestGroupFlightsByGlider:
    def test_when_there_are_no_flights_then_return_empty_list(self):
        # Given
        flights = []
        i18n_client = MockI18nClient()

        # When
        result = i18n_client._group_flights_by_glider(flights)

        # Then
        assert result == []

    def test_when_there_is_one_flight_then_return_list_with_one_element(self):
        # Given
        glider_1 = MagicMock(
            id=1,
            call_sign="call_sign_1",
            num_seats=1,
            type="type_1",
        )

        flights = [
            MagicMock(
                action_id=1,
                state="state_1",
                take_off_at=datetime.datetime(2021, 1, 1, 10, 0),
                landing_at=datetime.datetime(2021, 1, 1, 11, 0),
                glider=glider_1,
            )
        ]

        i18n_client = MockI18nClient()

        # When
        result = i18n_client._group_flights_by_glider(flights)

        # Then
        assert result == [("call_sign_1", 1, "01:00:00", "test")]

    def test_when_there_are_two_flights_with_same_glider_then_return_list_with_one_element(
        self,
    ):
        # Given
        glider_1 = MagicMock(
            id=1,
            call_sign="call_sign_1",
            num_seats=1,
            type="type_1",
        )

        flights = [
            MagicMock(
                action_id=1,
                state="state_1",
                take_off_at=datetime.datetime(2021, 1, 1, 10, 0),
                landing_at=datetime.datetime(2021, 1, 1, 11, 0),
                glider=glider_1,
            ),
            MagicMock(
                action_id=1,
                state="state_1",
                take_off_at=datetime.datetime(2021, 1, 1, 12, 0),
                landing_at=datetime.datetime(2021, 1, 1, 13, 0),
                glider=glider_1,
            ),
        ]

        i18n_client = MockI18nClient()

        # When
        result = i18n_client._group_flights_by_glider(flights)

        # Then
        assert result == [("call_sign_1", 2, "02:00:00", "test")]
