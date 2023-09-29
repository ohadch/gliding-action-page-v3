"""
This module implements the TowAirplaneDeactivatedEventHandler class.
"""
from typing import List

from src import Event, Notification
from src.database import SessionLocal
from src.events.handlers.event_handler import EventHandler
from src.events.types import EventPayloadSchema
from src.notifications.types import NotificationPayloadSchema
from src.utils.enums import NotificationType


class TowAirplaneDeactivatedEventHandler(EventHandler):
    def handle(self, event: Event) -> None:
        payload = EventPayloadSchema(**event.payload)
        session = SessionLocal()

        notifications: List[Notification] = []

        if payload.tow_airplane_id and payload.tow_pilot_id:
            notifications.append(
                Notification(
                    action_id=event.action_id,
                    recipient_member_id=payload.tow_pilot_id,
                    type=NotificationType.SummaryForTowPilot.value,
                    payload=NotificationPayloadSchema(
                        tow_airplane_id=payload.tow_airplane_id,
                        tow_pilot_id=payload.tow_pilot_id,
                    ).model_dump(),
                )
            )

        for notification in notifications:
            session.add(notification)

        session.commit()
