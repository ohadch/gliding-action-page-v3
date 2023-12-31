import abc
import logging
import os

from src import Notification
from src.database import SessionLocal
from src.emails.email_client import EmailClient
from src.i18n import i18n_client_factory
from src.notifications.types import NotificationPayloadSchema
from src.utils.enums import NotificationMethod


DEFAULT_NOTIFICATION_METHOD = NotificationMethod(
    os.environ["DEFAULT_NOTIFICATION_METHOD"]
)


class NotificationHandler(abc.ABC):
    def __init__(self, notification: Notification):
        self._notification = notification
        self._logger = logging.getLogger(__name__)
        self._session = SessionLocal()
        self._email_client = EmailClient()
        self._i18n = i18n_client_factory()

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
            return self._send_via_email()
        elif notification_method is NotificationMethod.CONSOLE:
            return self._send_via_console()
        else:
            raise ValueError(f"Invalid notification method: {notification_method}")

    @abc.abstractmethod
    def _send_via_email(self) -> None:
        pass

    @abc.abstractmethod
    def _send_via_console(self) -> None:
        pass

    @property
    def _payload(self) -> NotificationPayloadSchema:
        return NotificationPayloadSchema(**self._notification.payload)
