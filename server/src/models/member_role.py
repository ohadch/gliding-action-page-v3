from sqlalchemy import Column, Integer
from sqlalchemy.orm import relationship

from src.database import Base


class MemberRole(Base):

    __tablename__ = "members_roles"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, nullable=False)
    role_id = Column(Integer, nullable=False)

    member = relationship("Member", back_populates="roles")
    role = relationship("Role", back_populates="members")
