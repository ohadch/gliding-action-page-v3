from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from src.database import Base


class GliderOwner(Base):

    __tablename__ = "gliders_owners"

    id = Column(Integer, primary_key=True, index=True)
    glider_id = Column(Integer, ForeignKey("gliders.id"), nullable=False)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)

    glider = relationship("Glider")
    member = relationship("Member")
