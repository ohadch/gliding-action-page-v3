import logging
import time

from src import Notification
from src.database import SessionLocal
from src.notifications.handlers import notification_handler_factory


class NotificationsConsumer:
    def __init__(self, interval_seconds: int = 10):
        self._interval_seconds = interval_seconds
        self._logger = logging.getLogger(__name__)

    def run(self):
        """
        Run notifications consumer
        """
        self._logger.info(
            f"The notifications consumer is running, interval: {self._interval_seconds} seconds"
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
            self._send_notification(notification)

    def _send_notification(self, notification: Notification):
        """
        Send notification to recipient
        :param notification: The notification
        """
        handler = notification_handler_factory(notification=notification)
        self._logger.info(
            f"Sending notification {notification.id} to recipient: {notification.recipient_member.email}"
        )
        handler.send_to_recipient(notification=notification)

    @staticmethod
    def _get_next_notification():
        """
        Get next notification to be sent
        """
        session = SessionLocal()
        notification = session.query(Notification).filter_by(sent_at=None).first()
        return notification
