from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from src.database import Base


class Action(Base):

    __tablename__ = "actions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False, unique=True)
    closed_at = Column(DateTime, nullable=True)
    field_responsible_id = Column(Integer, ForeignKey("members.id"), nullable=True)
    responsible_cfi_id = Column(Integer, ForeignKey("members.id"), nullable=True)
    data_exported_at = Column(DateTime, nullable=True)

    field_responsible = relationship("Member", foreign_keys=[field_responsible_id])
    responsible_cfi = relationship("Member", foreign_keys=[responsible_cfi_id])
