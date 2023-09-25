from sqlalchemy import Column, Integer, String

from src.database import Base


class Member(Base):

    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone_number = Column(String, nullable=True)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
