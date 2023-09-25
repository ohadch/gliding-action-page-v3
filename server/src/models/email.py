from sqlalchemy import Column, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from src.database import Base


class Email(Base):

    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)
    sent_at = Column(DateTime, nullable=True)
    num_sending_attempts = Column(Integer, nullable=False, default=0)
    last_sending_attempt_at = Column(DateTime, nullable=True)
    recipient_member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    content = Column(Text, nullable=False)

    recipient_member = relationship("Member")
