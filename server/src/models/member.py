from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from src.config.database import Base
from src.utils.enums import AircraftTypeId


class Aircraft(Base):

    __tablename__ = "aircraft"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone_number = Column(String, nullable=True)

    roles = relationship("Role", back_populates="member")
    owned_aircraft = relationship("Aircraft", secondary="aircraft_owners", back_populates="owners")

    @property
    def is_secondary_tow_airplane(self):
        return AircraftTypeId(self.type) is AircraftTypeId.SecondaryTowAirplane

    @property
    def is_main_tow_airplane(self):
        return AircraftTypeId(self.type) is AircraftTypeId.MainTowAirplane

    @property
    def is_tow_airplane(self):
        return self.is_main_tow_airplane or self.is_secondary_tow_airplane

    @property
    def is_self_launch_only(self):
        return AircraftTypeId(self.type) is AircraftTypeId.TouringGlider

    @property
    def is_self_launch_possible(self):
        return self.is_self_launch_only or AircraftTypeId(self.type) is AircraftTypeId.SelfLaunch

    @property
    def is_glider(self):
        return not self.is_tow_airplane

