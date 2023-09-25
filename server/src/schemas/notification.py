import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class NotificationSchema(BaseModel):
    id: int
    sent_at: datetime.datetime
    num_sending_attempts: int
    last_attempt_at: Optional[datetime.datetime]
    recipient_member_id: int
    content: str

    model_config = ConfigDict(from_attributes=True)


class NotificationCreateSchema(BaseModel):
    recipient_member_id: int
    content: str


class NotificationUpdateSchema(BaseModel):
    recipient_member_id: Optional[int] = None
    content: Optional[str] = None


class NotificationSearchSchema(NotificationUpdateSchema):
    pass
