from sqlalchemy import Column, Integer, String

from src.database import Base


class Glider(Base):

    __tablename__ = "gliders"

    id = Column(Integer, primary_key=True, index=True)
    call_sign = Column(String, nullable=False)
    num_seats = Column(Integer, nullable=False)
    type = Column(String, nullable=False)
