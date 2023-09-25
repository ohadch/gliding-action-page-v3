import datetime
import logging
import os
import time

from src import Event
from src.database import SessionLocal
from src.events.handlers import event_handler_factory
from src.utils.enums import EventState


class EventsConsumer:
    def __init__(
        self,
        interval_seconds: int = 10,
        backoff_after_num_attempts: int = 3,
    ):
        self._interval_seconds = interval_seconds
        self._backoff_after_num_attempts = backoff_after_num_attempts
        self._logger = logging.getLogger(__name__)

    def run(self):
        """
        Run events consumer
        """
        self._logger.info(
            f"The events consumer is running, "
            f"interval: {self._interval_seconds} seconds, "
            f"default handler: {os.environ['DEFAULT_NOTIFICATION_METHOD']}"
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
            self._logger.debug(f"Processing event: {event.id}")
            self._handle_event(event)
        else:
            self._logger.debug("No events to process")

    def _handle_event(self, event: Event):
        """
        Send event to recipient
        :param event: The event
        """
        try:
            handler = event_handler_factory(event=event)
            self._logger.info(
                f"Sending event {event.id} to recipient: {event.recipient_member.email}, "
                f"handler: {handler.__class__.__name__}"
            )
            handler.handle(event=event)
            event.sent_at = datetime.datetime.utcnow()
            event.state = EventState.HANDLED.value
        except Exception as e:
            self._logger.exception(f"Failed to send event: {e}")
            event.state = EventState.FAILED.value
        finally:
            session = SessionLocal()
            session.add(event)
            session.commit()

    def _get_next_event(self):
        """
        Get next event to be sent
        """
        session = SessionLocal()
        event = (
            session.query(Event)
            .filter(
                Event.sent_at is None,
                Event.state
                in [
                    EventState.PENDING.value,
                    EventState.FAILED.value,
                ],
                Event.num_sending_attempts < self._backoff_after_num_attempts,
            )
            .first()
        )

        if event:
            event.num_sending_attempts += 1
            event.last_sending_attempt_at = datetime.datetime.utcnow()
            event.state = EventState.BEING_HANDLED.value
            session.commit()

        return event
