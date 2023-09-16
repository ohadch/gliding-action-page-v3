from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from src.config.database import Base
from src.utils.enums import AircraftTypeId


class Glider(Base):

    __tablename__ = "gliders"

    id = Column(Integer, primary_key=True, index=True)
    call_sign = Column(String, nullable=False)
    num_seats = Column(Integer, nullable=False)
    type = Column(Integer, nullable=False)

    owners = relationship("User", secondary="aircraft_owners", back_populates="aircraft")

    @property
    def is_self_launch_only(self):
        return AircraftTypeId(self.type) is AircraftTypeId.TouringGlider

    @property
    def is_self_launch_possible(self):
        return self.is_self_launch_only or AircraftTypeId(self.type) is AircraftTypeId.SelfLaunch

    @property
    def is_glider(self):
        return not self.is_tow_airplane

