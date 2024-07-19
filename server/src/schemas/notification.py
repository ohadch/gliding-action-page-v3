import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from src.notifications.types import NotificationPayloadSchema
from src.utils.enums import NotificationMethod, NotificationType, NotificationState


class NotificationSchema(BaseModel):
    id: int
    action_id: int
    created_at: datetime.datetime
    sent_at: Optional[datetime.datetime] = None
    num_sending_attempts: int
    last_sending_attempt_at: Optional[datetime.datetime] = None
    recipient_member_id: int
    method: Optional[NotificationMethod] = None
    type: NotificationType
    payload: NotificationPayloadSchema
    state: NotificationState
    originator_event_id: Optional[int] = None
    traceback: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class NotificationCreateSchema(BaseModel):
    action_id: int
    recipient_member_id: int
    payload: NotificationPayloadSchema
    type: NotificationType
    method: Optional[NotificationMethod] = None


class NotificationUpdateSchema(BaseModel):
    recipient_member_id: Optional[int] = None
    payload: Optional[NotificationPayloadSchema] = None
    type: Optional[NotificationType] = None
    method: Optional[NotificationMethod] = None
    state: Optional[NotificationState] = None
    num_sending_attempts: Optional[int] = None
    last_sending_attempt_at: Optional[datetime.datetime] = None


class NotificationSearchSchema(NotificationUpdateSchema):
    action_id: Optional[int] = None
