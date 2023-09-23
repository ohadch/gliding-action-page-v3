from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship

from src.database import Base


class MemberRole(Base):

    __tablename__ = "members_roles"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    role = Column(String, nullable=False)

    member = relationship("Member", foreign_keys=[member_id])
