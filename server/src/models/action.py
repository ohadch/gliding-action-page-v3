from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.orm import relationship

from src.config.database import Base


class Action(Base):

    __tablename__ = "actions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False)
    closed_at = Column(DateTime, nullable=True)
    field_responsible_id = Column(Integer, nullable=False)
    responsible_cfi_id = Column(Integer, nullable=False)
    instruction_glider_id = Column(Integer, nullable=False)

    field_responsible = relationship("User", foreign_keys=[field_responsible_id])
    responsible_cfi = relationship("User", foreign_keys=[responsible_cfi_id])
    instruction_glider = relationship("Glider", foreign_keys=[instruction_glider_id])
    flights = relationship("Flight", back_populates="action")
    active_tow_airplanes = relationship("ActiveTowAirplane", back_populates="action")
