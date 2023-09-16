from sqlalchemy import Column, Integer, DateTime, String
from sqlalchemy.orm import relationship

from src.config.database import Base


class Aircraft(Base):

    __tablename__ = "aircraft"

    id = Column(Integer, primary_key=True, index=True)
    call_sign = Column(String, nullable=False)
    num_seats = Column(Integer, nullable=False)
    type = Column(Integer, nullable=False)

    owners = relationship("User", secondary="aircraft_owners", back_populates="aircraft")

    @property
    def is_glider(self):
        return self.type == 0