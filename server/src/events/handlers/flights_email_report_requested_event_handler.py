from src import Event, Notification
from src.database import SessionLocal
from src.events.handlers.event_handler import EventHandler
from src.events.types import EventPayloadSchema
from src.notifications.types import NotificationPayloadSchema
from src.utils.enums import NotificationType


class FlightsEmailReportRequestedEventHandler(EventHandler):
    def handle(self, event: Event) -> None:
        """
        Handles the action data export requested event.
        """
        session = SessionLocal()
        payload = EventPayloadSchema.model_validate(event.payload)

        if not payload.recipient_member_id or not payload.flights_ids:
            raise ValueError("Recipient member ID and flights IDs are required")

        notification = Notification(
            action_id=event.action_id,
            originator_event_id=event.id,
            recipient_member_id=payload.recipient_member_id,
            type=NotificationType.FlightsEmailReport.value,
            payload=NotificationPayloadSchema(
                flights_ids=payload.flights_ids or [],
            ).model_dump(),
        )

        session.add(notification)
        session.commit()
