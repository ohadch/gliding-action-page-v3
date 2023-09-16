import datetime
from typing import Optional

from pydantic import BaseModel


class SentEmailSchema(BaseModel):
    id: int
    sent_at: datetime.datetime
    recipient_member_id: int
    flight_id: Optional[int]

    class Config:
        orm_mode = True


class SentEmailCreateSchema(BaseModel):
    sent_at: datetime.datetime
    recipient_member_id: int
    flight_id: Optional[int]


class SentEmailUpdateSchema(BaseModel):
    sent_at: Optional[datetime.datetime]
    recipient_member_id: Optional[int]
    flight_id: Optional[Optional[int]]
