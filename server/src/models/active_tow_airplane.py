from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.orm import relationship

from src.database import Base


class ActiveTowAirplane(Base):

    __tablename__ = "active_tow_airplanes"

    id = Column(Integer, primary_key=True, index=True)
    action_id = Column(Integer, nullable=False)
    tow_pilot_id = Column(Integer, nullable=False)
    airplane_id = Column(Integer, nullable=False)

    action = relationship("Action", back_populates="active_tow_airplanes")
    tow_pilot = relationship("Member", foreign_keys=[tow_pilot_id])
    airplane = relationship("Airplane", foreign_keys=[airplane_id])
