from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from src.database import Base


class Email(Base):

    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)
    sent_at = Column(DateTime, nullable=False)
    recipient_member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    flight_id = Column(Integer, ForeignKey("flights.id"), nullable=False)
    
    flight = relationship("Flight")
    recipient_member = relationship("Member")
    
    
