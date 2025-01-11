import datetime
from uuid import UUID

import psycopg2
import sqlalchemy.exc
from sqlalchemy.orm import Session

from ..models import Action
from ..schemas import (
    ActionSchema,
    ActionSearchSchema,
    ActionCreateSchema,
    ActionUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class ActionCrud(
    GenericModelCrud[
        Action,
        UUID,
        ActionSchema,
        ActionSearchSchema,
        ActionCreateSchema,
        ActionUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=Action)

    def get_or_create_action_by_date(self, db: Session, date: datetime.date) -> Action:
        """
        Get or create action by date
        :param db: Database session
        :param date: Date
        :return: Action
        """
        action = db.query(self.model).filter(self.model.date == date).first()

        if not action:
            try:
                action = self.model(
                    date=datetime.datetime(date.year, date.month, date.day)
                )
                db.add(action)
                db.commit()
                db.refresh(action)
            except (psycopg2.errors.UniqueViolation, sqlalchemy.exc.IntegrityError):
                action = db.query(self.model).filter(self.model.date == date).first()

        return action
