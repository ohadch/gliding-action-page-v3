from sqlalchemy import Column, Integer, String

from src.database import Base


class FlightType(Base):

    __tablename__ = "flight_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
