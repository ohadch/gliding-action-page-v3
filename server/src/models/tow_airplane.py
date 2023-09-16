from sqlalchemy import Column, Integer, String

from src.database import Base
from src.utils.enums import AircraftTypeId


class TowAirplane(Base):

    __tablename__ = "tow_airplanes"

    id = Column(Integer, primary_key=True, index=True)
    call_sign = Column(String, nullable=False)
    type = Column(Integer, nullable=False)

    @property
    def is_secondary_tow_airplane(self):
        return AircraftTypeId(self.type) is AircraftTypeId.SecondaryTowAirplane

    @property
    def is_main_tow_airplane(self):
        return AircraftTypeId(self.type) is AircraftTypeId.MainTowAirplane
