import datetime
from unittest.mock import MagicMock

from freezegun import freeze_time

from src.notifications.notifications_consumer import NotificationsConsumer
from src.utils.enums import NotificationState

EXECUTION_NAMESPACE = "src.notifications.notifications_consumer"


class TestHandleNotification:
    @freeze_time("2022-01-01")
    def test_happy_path(self, mocker):
        # Given
        notification = MagicMock()
        session = MagicMock()
        notifications_consumer = NotificationsConsumer(
            session=session,
        )
        notifications_handler = MagicMock()

        def _notification_handler_factory_mock(**kwargs):
            if kwargs["notification"] == notification:
                return notifications_handler

            raise ValueError(
                f"[TEST] Unexpected notification: {kwargs['notification']}"
            )

        mocker.patch(
            f"{EXECUTION_NAMESPACE}.notification_handler_factory",
            MagicMock(side_effect=_notification_handler_factory_mock),
        )

        # When
        notifications_consumer._handle_notification(notification=notification)

        # Then
        notifications_handler.send.assert_called_once_with()
        session.add.assert_called_once_with(notification)
        session.commit.assert_called_once()
        assert notification.sent_at == datetime.datetime.utcnow()
        assert notification.state == NotificationState.SENT.value

    def test_handler_raises_exception(self, mocker):
        # Given
        notification = MagicMock()
        notification.sent_at = None
        session = MagicMock()
        notifications_consumer = NotificationsConsumer(
            session=session,
        )
        notifications_handler = MagicMock()
        notifications_handler.send.side_effect = Exception("Test Error")

        def _notification_handler_factory_mock(**kwargs):
            if kwargs["notification"] == notification:
                return notifications_handler

            raise ValueError(
                f"[TEST] Unexpected notification: {kwargs['notification']}"
            )

        mocker.patch(
            f"{EXECUTION_NAMESPACE}.notification_handler_factory",
            MagicMock(side_effect=_notification_handler_factory_mock),
        )

        # When
        notifications_consumer._handle_notification(notification=notification)

        # Then
        notifications_handler.send.assert_called_once_with()
        session.add.assert_called_once_with(notification)
        session.commit.assert_called_once()
        assert notification.state == NotificationState.FAILED.value
        assert notification.traceback is not None
        assert "Test Error" in notification.traceback
        assert notification.sent_at is None
