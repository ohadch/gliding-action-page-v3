import datetime
import logging
import os
import time
from typing import Optional

from src import Notification
from src.database import SessionLocal
from src.notifications.handlers import notification_handler_factory
from src.utils.enums import NotificationState


class NotificationsConsumer:
    def __init__(
        self,
        interval_seconds: int = 10,
        backoff_after_num_attempts: int = 3,
    ):
        self._interval_seconds = interval_seconds
        self._backoff_after_num_attempts = backoff_after_num_attempts
        self._logger = logging.getLogger(__name__)
        self._session = SessionLocal()

    def run(self):
        """
        Run notifications consumer
        """
        self._logger.info(
            f"The notifications consumer is running, "
            f"interval: {self._interval_seconds} seconds, "
            f"default handler: {os.environ['DEFAULT_NOTIFICATION_METHOD']}"
        )

        while True:
            self._process_notifications()
            self._logger.debug(f"Sleeping for {self._interval_seconds} seconds...")
            time.sleep(self._interval_seconds)

    def _process_notifications(self):
        """
        Process notifications
        """
        notification = self._get_next_notification()

        if notification:
            self._logger.debug(f"Processing notification: {notification}")
            self._handle_notification(notification=notification)
        else:
            self._logger.debug("No notifications to process")

    def _handle_notification(self, notification: Notification):
        """
        Send notification to recipient
        :param notification: notification to be sent
        """
        try:
            handler = notification_handler_factory(notification=notification)
            self._logger.info(
                f"Sending notification {notification.id} to recipient: {notification.recipient_member.email}, "
                f"handler: {handler.__class__.__name__}"
            )
            handler.send_to_recipient(notification=notification)
            notification.sent_at = datetime.datetime.utcnow()
            notification.state = NotificationState.SENT.value
        except Exception as e:
            self._logger.exception(f"Failed to send notification: {e}")
            notification.state = NotificationState.FAILED.value
        finally:
            self._session.add(notification)
            self._session.commit()

    def _get_next_notification(self) -> Optional[Notification]:
        """
        Get next notification to be sent
        """
        notification = (
            self._session.query(Notification)
            .filter(
                (
                    (Notification.state == NotificationState.PENDING.value)
                    | (Notification.state == NotificationState.FAILED.value)
                )
                & (Notification.num_sending_attempts < self._backoff_after_num_attempts)
                & (Notification.sent_at == None)
            )
            .first()
        )

        if not notification:
            return None

        notification.num_sending_attempts += 1
        notification.last_sending_attempt_at = datetime.datetime.utcnow()
        notification.state = NotificationState.BEING_HANDLED.value
        self._session.commit()

        return notification
