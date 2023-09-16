import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class EmailSchema(BaseModel):
    id: int
    sent_at: datetime.datetime
    recipient_member_id: int
    flight_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class EmailCreateSchema(BaseModel):
    sent_at: datetime.datetime
    recipient_member_id: int
    flight_id: Optional[int] = None


class EmailUpdateSchema(BaseModel):
    sent_at: Optional[datetime.datetime]
    recipient_member_id: Optional[int] = None
    flight_id: Optional[int] = None


class EmailSearchSchema(EmailUpdateSchema):
    pass
