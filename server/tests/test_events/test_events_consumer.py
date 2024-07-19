import datetime
from unittest.mock import MagicMock

from freezegun import freeze_time

from src.events.events_consumer import EventsConsumer
from src.utils.enums import EventState

EXECUTION_NAMESPACE = "src.events.events_consumer"


class TestHandleEvent:
    @freeze_time("2022-01-01")
    def test_happy_path(self, mocker):
        # Given
        event = MagicMock()
        session = MagicMock()
        events_consumer = EventsConsumer(
            session=session,
        )
        events_handler = MagicMock()

        def _event_handler_factory_mock(**kwargs):
            if kwargs["event"] == event:
                return events_handler

            raise ValueError(f"[TEST] Unexpected event: {kwargs['event']}")

        mocker.patch(
            f"{EXECUTION_NAMESPACE}.event_handler_factory",
            MagicMock(side_effect=_event_handler_factory_mock),
        )

        # When
        events_consumer._handle_event(event=event)

        # Then
        events_handler.handle.assert_called_once_with(event=event)
        session.add.assert_called_once_with(event)
        session.commit.assert_called_once()
        assert event.handled_at == datetime.datetime.utcnow()
        assert event.state == EventState.HANDLED.value

    def test_handler_raises_exception(self, mocker):
        # Given
        event = MagicMock()
        event.handled_at = None
        session = MagicMock()
        events_consumer = EventsConsumer(
            session=session,
        )
        events_handler = MagicMock()
        events_handler.handle.side_effect = Exception("Test Error")

        def _event_handler_factory_mock(**kwargs):
            if kwargs["event"] == event:
                return events_handler

            raise ValueError(f"[TEST] Unexpected event: {kwargs['event']}")

        mocker.patch(
            f"{EXECUTION_NAMESPACE}.event_handler_factory",
            MagicMock(side_effect=_event_handler_factory_mock),
        )

        # When
        events_consumer._handle_event(event=event)

        # Then
        events_handler.handle.assert_called_once_with(event=event)
        session.add.assert_called_once_with(event)
        session.commit.assert_called_once()
        assert event.state == EventState.FAILED.value
        assert event.traceback is not None
        assert "Test Error" in event.traceback
        assert event.handled_at is None
