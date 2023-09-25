import datetime

from sqlalchemy import Column, Integer, String, JSON, DateTime

from src.database import Base
from src.utils.enums import EventState


class Event(Base):

    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    type: str = Column(String, nullable=False)
    state: str = Column(String, nullable=False, default=EventState.PENDING.value)
    payload: dict = Column(JSON, nullable=False)
    created_at: datetime.datetime = Column(
        DateTime, nullable=False, default=datetime.datetime.utcnow
    )
    handled_at: datetime.datetime = Column(DateTime, nullable=True)
    num_handling_attempts: int = Column(Integer, nullable=False, default=0)
