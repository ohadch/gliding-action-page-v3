import datetime

from sqlalchemy import Column, Integer, DateTime, ForeignKey, JSON, String
from sqlalchemy.orm import relationship

from src.database import Base
from src.utils.enums import NotificationState


class Notification(Base):

    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    action_id = Column(Integer, ForeignKey("actions.id"), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
    sent_at = Column(DateTime, nullable=True)
    num_sending_attempts = Column(Integer, nullable=False, default=0)
    last_sending_attempt_at = Column(DateTime, nullable=True)
    recipient_member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    method = Column(String, nullable=True)
    type = Column(String, nullable=False)
    payload = Column(JSON, nullable=False)
    state = Column(String, nullable=False, default=NotificationState.PENDING.value)
    originator_event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    traceback = Column(String, nullable=True)

    recipient_member = relationship("Member")
    action = relationship("Action")
    originator_event = relationship("Event", foreign_keys=[originator_event_id])
