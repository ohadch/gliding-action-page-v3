import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from src.notifications.types import NotificationPayloadSchema
from src.utils.enums import NotificationMethod, NotificationType, NotificationState


class NotificationSchema(BaseModel):
    id: int
    sent_at: datetime.datetime
    num_sending_attempts: int
    last_attempt_at: Optional[datetime.datetime]
    recipient_member_id: int
    method: NotificationMethod
    type: NotificationType
    payload: NotificationPayloadSchema
    state: NotificationState

    model_config = ConfigDict(from_attributes=True)


class NotificationCreateSchema(BaseModel):
    recipient_member_id: int
    payload: NotificationPayloadSchema
    type: NotificationType
    method: Optional[NotificationMethod] = None


class NotificationUpdateSchema(BaseModel):
    recipient_member_id: Optional[int] = None
    payload: Optional[NotificationPayloadSchema] = None
    type: Optional[NotificationType] = None
    method: Optional[NotificationMethod] = None


class NotificationSearchSchema(NotificationUpdateSchema):
    pass
