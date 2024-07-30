import datetime

from src import Event, Action
from src.database import SessionLocal
from src.etl.etl_client import EtlClient
from src.events.handlers import EventHandler


class ActionDataExportRequestededEventHandler(EventHandler):
    def handle(self, event: Event) -> None:
        """
        Handles the action data export requested event.
        """
        session = SessionLocal()
        etl_client = EtlClient.from_env()

        action = session.query(Action).filter_by(id=event.action_id).first()
        etl_client.export_data(action_date=action.date.date(), force=True)

        action.data_exported_at = datetime.datetime.now()
        session.add(action)
        session.commit()
