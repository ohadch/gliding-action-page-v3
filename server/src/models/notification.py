from sqlalchemy import Column, Integer, DateTime, ForeignKey, JSON, String
from sqlalchemy.orm import relationship

from src.database import Base


class Notification(Base):

    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    sent_at = Column(DateTime, nullable=True)
    num_sending_attempts = Column(Integer, nullable=False, default=0)
    last_sending_attempt_at = Column(DateTime, nullable=True)
    recipient_member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    method = Column(String, nullable=True)
    type = Column(String, nullable=False)
    config = Column(JSON, nullable=False)

    recipient_member = relationship("Member")
