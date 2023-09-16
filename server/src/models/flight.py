from sqlalchemy import Column, Integer, DateTime, String
from sqlalchemy.orm import relationship

from src.config.database import Base


class Flight(Base):

    __tablename__ = "flights"

    id = Column(Integer, primary_key=True, index=True)
    action_id = Column(Integer, nullable=False)
    take_off_at = Column(DateTime, nullable=True)
    landing_at = Column(DateTime, nullable=True)

    glider_id = Column(Integer, nullable=True)
    pilot_1_id = Column(Integer, nullable=True)
    pilot_2_id = Column(Integer, nullable=True)
    tow_airplane_id = Column(Integer, nullable=True)
    tow_pilot_id = Column(Integer, nullable=True)
    tow_type_id = Column(Integer, nullable=True)
    flight_type_id = Column(Integer, nullable=True)
    payers_type_id = Column(Integer, nullable=True)
    payment_method_id = Column(Integer, nullable=True)
    payment_receiver_id = Column(Integer, nullable=True)
    paying_member_id = Column(Integer, nullable=True)
    status = Column(String, nullable=False)

    glider = relationship("Glider", back_populates="flights")
    pilot_1 = relationship("Member", foreign_keys=[pilot_1_id])
    pilot_2 = relationship("Member", foreign_keys=[pilot_2_id])
    tow_airplane = relationship("TowAirplane", back_populates="flights")
    tow_pilot = relationship("Member", foreign_keys=[tow_pilot_id])
    tow_type = relationship("TowType", back_populates="flights")
    flight_type = relationship("FlightType", back_populates="flights")
    payers_type = relationship("PayersType", back_populates="flights")
    payment_method = relationship("PaymentMethod", back_populates="flights")
    payment_receiver = relationship("Member", foreign_keys=[payment_receiver_id])
    paying_member = relationship("Member", foreign_keys=[paying_member_id])
    action = relationship("Action", back_populates="flights")
    sent_emails = relationship("SentEmail", back_populates="flight")
