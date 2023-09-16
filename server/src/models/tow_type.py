from sqlalchemy import Column, Integer, String

from src.database import Base


class TowType(Base):

    __tablename__ = "tow_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
