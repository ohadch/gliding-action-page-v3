import datetime

from src import Event, Action
from src.database import SessionLocal
from src.etl import etl_client_factory
from src.events.handlers.event_handler import EventHandler


class ActionDataExportRequestedEventHandler(EventHandler):
    def handle(self, event: Event) -> None:
        """
        Handles the action data export requested event.
        """
        session = SessionLocal()
        etl_client = etl_client_factory()

        action = session.query(Action).filter_by(id=event.action_id).first()
        etl_client.export_data(action_date=action.date.date(), force=True)

        action.data_exported_at = datetime.datetime.now()
        session.add(action)
        session.commit()
