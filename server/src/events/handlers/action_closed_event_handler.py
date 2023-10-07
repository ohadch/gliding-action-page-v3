"""
This module implements the ActionClosedEventHandler class.
"""
from typing import List

from src import Event, Notification, MemberRole
from src.database import SessionLocal
from src.events.handlers.event_handler import EventHandler
from src.events.types import EventPayloadSchema
from src.utils.enums import NotificationType, Role


class ActionClosedEventHandler(EventHandler):
    def handle(self, event: Event) -> None:
        payload = EventPayloadSchema(**event.payload)
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
