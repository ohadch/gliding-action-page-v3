from sqlalchemy import Column, Integer, String

from src.database import Base
from src.utils.enums import RoleId


class Member(Base):

    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone_number = Column(String, nullable=True)

    def has_role(self, role_id: RoleId) -> bool:
        return any(role.role_id == role_id for role in self.roles)
