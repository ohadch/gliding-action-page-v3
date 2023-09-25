from sqlalchemy import Column, Integer, String, JSON

from src.database import Base
from src.utils.enums import EventState


class Event(Base):

    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    type: str = Column(String, nullable=False)
    state: str = Column(String, nullable=False, default=EventState.PENDING)
    payload: str = Column(JSON, nullable=False)
    created_at: str = Column(String, nullable=False)
    handled_at: str = Column(String, nullable=True)
    num_handling_attempts: int = Column(Integer, nullable=False, default=0)
