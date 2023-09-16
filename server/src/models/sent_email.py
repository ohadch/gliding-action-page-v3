from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.orm import relationship

from src.config.database import Base


class SentEmail(Base):

    __tablename__ = "sent_emails"

    id = Column(Integer, primary_key=True, index=True)
    sent_at = Column(DateTime, nullable=False)
    recipient_member_id = Column(Integer, nullable=False)
    flight_id = Column(Integer, nullable=True)
    
    flight = relationship("Flight", back_populates="sent_emails")
    recipient_member = relationship("Member", back_populates="sent_emails")
    
    
