from sqlalchemy import Column, Integer, String

from src.database import Base


class TowAirplane(Base):

    __tablename__ = "tow_airplanes"

    id = Column(Integer, primary_key=True, index=True)
    call_sign = Column(String, nullable=False)
