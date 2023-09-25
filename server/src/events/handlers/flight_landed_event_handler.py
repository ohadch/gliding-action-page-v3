"""
This module implements the FlightLandedEventHandler class.
"""
from typing import List

from src import Event, Notification, Flight
from src.database import SessionLocal
from src.events.handlers.event_handler import EventHandler
from src.events.types import EventPayloadSchema
from src.notifications.types import NotificationPayloadSchema
from src.utils.enums import NotificationType


class FlightLandedEventHandler(EventHandler):
    def handle(self, event: Event) -> None:
        payload = EventPayloadSchema(**event.payload)
        session = SessionLocal()

        notifications: List[Notification] = []

        if payload.flight_id:
            flight = session.query(Flight).get(payload.flight_id)

            if flight.pilot_1_id:
                self._logger.info(
                    f"Creating flight summary notification to pilot 1: {flight.pilot_1_id}"
                )
                notifications.append(
                    Notification(
                        recipient_member_id=flight.pilot_1_id,
                        event_id=event.id,
                        type=NotificationType.FlightSummaryForPilot,
                        payload=NotificationPayloadSchema(flight_ids=[flight.id]),
                    )
                )

            if flight.pilot_2_id:
                self._logger.info(
                    f"Creating flight summary notification to pilot 2: {flight.pilot_2_id}"
                )
                notifications.append(
                    Notification(
                        recipient_member_id=flight.pilot_2_id,
                        event_id=event.id,
                        type=NotificationType.FlightSummaryForPilot,
                        payload=NotificationPayloadSchema(flight_ids=[flight.id]),
                    )
                )

        for notification in notifications:
            session.add(notification)

        session.commit()
