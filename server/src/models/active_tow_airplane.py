from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from src.database import Base


class ActiveTowAirplane(Base):

    __tablename__ = "active_tow_airplanes"

    id = Column(Integer, primary_key=True, index=True)
    action_id = Column(Integer, ForeignKey("actions.id"), nullable=False)
    tow_pilot_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    airplane_id = Column(Integer, ForeignKey("tow_airplanes.id"), nullable=False)

    action = relationship("Action")
    tow_pilot = relationship("Member", foreign_keys=[tow_pilot_id])
    airplane = relationship("TowAirplane", foreign_keys=[airplane_id])

    __table_args__ = (
        UniqueConstraint("action_id", "airplane_id", name="unique_action_airplane"),
        UniqueConstraint("action_id", "tow_pilot_id", name="unique_action_tow_pilot"),
    )
