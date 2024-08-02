import datetime

from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship

from src.database import Base


class Comment(Base):

    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow
    )
    author_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    action_id = Column(Integer, ForeignKey("actions.id"), nullable=False)
    flight_id = Column(Integer, ForeignKey("flights.id"), nullable=True)
    text = Column(Text, nullable=False)

    author = relationship("Member", foreign_keys=[author_id])
    action = relationship("Action", foreign_keys=[action_id])
    flight = relationship("Flight", foreign_keys=[flight_id])
