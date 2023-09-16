from sqlalchemy import Column, Integer, DateTime, String, ForeignKey
from sqlalchemy.orm import relationship

from src.database import Base


class Flight(Base):

    __tablename__ = "flights"

    id = Column(Integer, primary_key=True, index=True)
    action_id = Column(Integer, ForeignKey("actions.id"), nullable=False)
    take_off_at = Column(DateTime, nullable=True)
    landing_at = Column(DateTime, nullable=True)

    glider_id = Column(Integer, ForeignKey("gliders.id"), nullable=False)
    pilot_1_id = Column(Integer, ForeignKey("members.id"), nullable=True)
    pilot_2_id = Column(Integer, ForeignKey("members.id"), nullable=True)
    tow_airplane_id = Column(Integer, ForeignKey("tow_airplanes.id"), nullable=True)
    tow_pilot_id = Column(Integer, ForeignKey("members.id"), nullable=True)
    tow_type_id = Column(Integer, ForeignKey("tow_types.id"), nullable=True)
    flight_type_id = Column(Integer, ForeignKey("flight_types.id"), nullable=True)
    payers_type_id = Column(Integer, ForeignKey("payers_types.id"), nullable=True)
    payment_method_id = Column(Integer, ForeignKey("payment_methods.id"), nullable=True)
    payment_receiver_id = Column(Integer, ForeignKey("members.id"), nullable=True)
    paying_member_id = Column(Integer, ForeignKey("members.id"), nullable=True)
    status = Column(String, nullable=False)

    glider = relationship("Glider")
    pilot_1 = relationship("Member", foreign_keys=[pilot_1_id])
    pilot_2 = relationship("Member", foreign_keys=[pilot_2_id])
    tow_airplane = relationship("TowAirplane")
    tow_pilot = relationship("Member", foreign_keys=[tow_pilot_id])
    tow_type = relationship("TowType")
    flight_type = relationship("FlightType")
    payers_type = relationship("PayersType")
    payment_method = relationship("PaymentMethod")
    payment_receiver = relationship("Member", foreign_keys=[payment_receiver_id])
    paying_member = relationship("Member", foreign_keys=[paying_member_id])
    action = relationship("Action")
