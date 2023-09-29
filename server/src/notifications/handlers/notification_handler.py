import abc
import logging
import os

from src import Notification
from src.notifications.types import NotificationPayloadSchema
from src.utils.enums import NotificationMethod


DEFAULT_NOTIFICATION_METHOD = NotificationMethod(
    os.environ["DEFAULT_NOTIFICATION_METHOD"]
)


class NotificationHandler(abc.ABC):
    def __init__(self, notification: Notification):
        self._notification = notification
        self._logger = logging.getLogger(__name__)

    def send(
        self,
    ) -> None:
        notification_manual_method = (
            NotificationMethod(self._notification.method)
            if self._notification.method
            else None
        )
        notification_method = notification_manual_method or DEFAULT_NOTIFICATION_METHOD

        self._logger.info(
            f"Sending notification {self._notification.id} to recipient: {self._notification.recipient_member.email}, "
            f"method: {notification_method}"
        )
        if notification_method is NotificationMethod.EMAIL:
            return self._send_via_email(notification=self._notification)
        elif notification_method is NotificationMethod.CONSOLE:
            return self._send_via_console(notification=self._notification)
        else:
            raise ValueError(f"Invalid notification method: {notification_method}")

    @abc.abstractmethod
    def _send_via_email(self, notification: Notification) -> None:
        pass

    @abc.abstractmethod
    def _send_via_console(self, notification: Notification) -> None:
        pass

    @property
    def _payload(self) -> NotificationPayloadSchema:
        return NotificationPayloadSchema(**self._notification.payload)
