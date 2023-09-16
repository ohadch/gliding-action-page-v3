from sqlalchemy import Column, Integer, String

from src.database import Base


class PayersType(Base):

    __tablename__ = "payers_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
