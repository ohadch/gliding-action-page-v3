from sqlalchemy import Column, Integer, String

from src.config.database import Base


class PaymentMethod(Base):

    __tablename__ = "payment_methods

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
