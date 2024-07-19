import datetime
import logging
import time
import traceback
from typing import Optional

from src import Event
from src.database import SessionLocal
from src.events.handlers import event_handler_factory
from src.utils.enums import EventState


class EventsConsumer:
    def __init__(
        self,
        interval_seconds: int = 10,
        backoff_after_num_attempts: int = 3,
        session: SessionLocal = SessionLocal(),
    ):
        self._interval_seconds = interval_seconds
        self._backoff_after_num_attempts = backoff_after_num_attempts
        self._logger = logging.getLogger(__name__)
        self._session = session

    def run(self):
        """
        Run events consumer
        """
        self._logger.info(
            f"The events consumer is running, "
            f"interval: {self._interval_seconds} seconds"
        )

        while True:
            self._process_events()
            self._logger.debug(f"Sleeping for {self._interval_seconds} seconds...")
            time.sleep(self._interval_seconds)

    def _process_events(self):
        """
        Process events
        """
        event = self._get_next_event()

        if event:
            self._logger.debug(f"Processing event: {event}")
            self._handle_event(event=event)
        else:
            self._logger.debug("No events to process")

    def _handle_event(self, event: Event):
        """
        Send event to recipient
        :param event: event to be sent
        """
        try:
            handler = event_handler_factory(event=event)
            self._logger.info(f"Handling event {event.id} with type {event.type}")
            handler.handle(event=event)
            event.handled_at = datetime.datetime.utcnow()
            event.state = EventState.HANDLED.value
        except Exception as e:
            self._logger.exception(f"Failed to send event: {e}")
            event.state = EventState.FAILED.value
            event.traceback = traceback.format_exc()
        finally:
            self._session.add(event)
            self._session.commit()

    def _get_next_event(self) -> Optional[Event]:
        """
        Get next event to be sent
        """
        event = (
            self._session.query(Event)
            .filter(
                (
                    (Event.state == EventState.PENDING.value)
                    | (Event.state == EventState.FAILED.value)
                )
                & (Event.num_handling_attempts < self._backoff_after_num_attempts)
                & (Event.handled_at == None)
            )
            .first()
        )

        if not event:
            return None

        event.num_handling_attempts += 1
        event.last_sending_attempt_at = datetime.datetime.utcnow()
        event.state = EventState.BEING_HANDLED.value
        self._session.commit()

        return event
