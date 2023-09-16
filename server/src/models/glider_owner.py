from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from src.config.database import Base
from src.utils.enums import AircraftTypeId


class GliderOwner(Base):

    __tablename__ = "gliders_owners"

    id = Column(Integer, primary_key=True, index=True)
    glider_id = Column(Integer, nullable=False)
    member_id = Column(Integer, nullable=False)

    glider = relationship("Glider", back_populates="glider_owners")
    member = relationship("Member", back_populates="owned_gliders")
