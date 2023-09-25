import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class EmailSchema(BaseModel):
    id: int
    sent_at: datetime.datetime
    num_sending_attempts: int
    last_attempt_at: Optional[datetime.datetime]
    recipient_member_id: int
    content: str

    model_config = ConfigDict(from_attributes=True)


class EmailCreateSchema(BaseModel):
    recipient_member_id: int
    content: str


class EmailUpdateSchema(BaseModel):
    recipient_member_id: Optional[int] = None
    content: Optional[str] = None


class EmailSearchSchema(EmailUpdateSchema):
    pass
