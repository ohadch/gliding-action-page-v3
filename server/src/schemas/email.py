import datetime
from typing import Optional

from pydantic import BaseModel


class EmailSchema(BaseModel):
    id: int
    sent_at: datetime.datetime
    recipient_member_id: int
    flight_id: Optional[int]

    class Config:
        orm_mode = True


class EmailCreateSchema(BaseModel):
    sent_at: datetime.datetime
    recipient_member_id: int
    flight_id: Optional[int]


class EmailUpdateSchema(BaseModel):
    sent_at: Optional[datetime.datetime]
    recipient_member_id: Optional[int]
    flight_id: Optional[Optional[int]]


class EmailSearchSchema(EmailUpdateSchema):
    pass
