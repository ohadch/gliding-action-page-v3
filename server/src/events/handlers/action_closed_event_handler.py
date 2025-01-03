"""
This module implements the ActionClosedEventHandler class.
"""
from tempfile import TemporaryDirectory
from typing import List

from src import Event, Notification, MemberRole, get_settings
from src.database import SessionLocal, engine
from src.emails.email_client import EmailClient
from src.events.handlers.event_handler import EventHandler
from src.utils.backup import PostgresBackupManager
from src.utils.enums import NotificationType, Role


class ActionClosedEventHandler(EventHandler):
    def handle(self, event: Event) -> None:
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

        self._send_database_backup_email(event)

    def _send_database_backup_email(self, event: Event) -> None:
        """
        Send an email with the database backup attached.
        :return: None
        """
        settings = get_settings()
        recipient = settings.database_backup_recipient_email
        action = event.action

        self._logger.info(
            f"Sending database backup email of action {action.id} to {recipient}"
        )

        with TemporaryDirectory() as temp_dir:
            backup_manager = PostgresBackupManager(engine)
            backup_path = backup_manager.backup(output_dir=temp_dir)
            settings = get_settings()
            email_client = EmailClient()
            email_client.send_email(
                to_email=settings.database_backup_recipient_email,
                subject=f"Database Backup - Action {action.id} - {action.date}",
                html_content="Please find the database backup attached.",
                attachment_path=backup_path,
            )

        self._logger.info(f"Database backup email sent to {recipient}")
