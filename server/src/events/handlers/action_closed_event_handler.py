"""
This module implements the ActionClosedEventHandler class.
"""
from typing import List

from src import Event, Notification, MemberRole, get_settings
from src.database import SessionLocal
from src.events.handlers.event_handler import EventHandler
from src.utils.backup import PostgresBackupManager
from src.utils.enums import NotificationType, Role


class ActionClosedEventHandler(EventHandler):
    def handle(self, event: Event) -> None:
        try:
            self._send_database_backup_email(event=event)
        except Exception as e:
            self._logger.error(
                f"An error occurred while sending the database backup email: {e}"
            )

        session = SessionLocal()

        observer_member_roles: List[MemberRole] = (
            session.query(MemberRole).filter_by(role=Role.Observer.value).all()
        )

        observer_member_ids = [
            member_role.member_id for member_role in observer_member_roles
        ]

        notifications: List[Notification] = []

        for observer_member_id in observer_member_ids:
            notifications.append(
                Notification(
                    action_id=event.action_id,
                    originator_event_id=event.id,
                    recipient_member_id=observer_member_id,
                    type=NotificationType.DailySummaryForObserver.value,
                    payload={},
                )
            )

        for notification in notifications:
            session.add(notification)

        session.commit()

    def _send_database_backup_email(self) -> None:
        """
        Send an email with the database backup attached.
        :return: None
        """
        settings = get_settings()
        recipient = settings.database_backup_recipient_email

        self._logger.info(f"Sending database backup email to {recipient}")
        backup_manager = PostgresBackupManager.from_env()
        backup_manager.backup_and_send_to_recipient()

        self._logger.info(f"Database backup email sent to {recipient}")
