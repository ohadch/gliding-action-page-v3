from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from src.database import Base


class MemberRole(Base):

    __tablename__ = "members_roles"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)

    member = relationship("Member")
    role = relationship("Role")
