from src import Event
from src.etl import etl_client_factory
from src.events.handlers.event_handler import EventHandler


class ReferenceDataImportRequestedEventHandler(EventHandler):
    def handle(self, event: Event) -> None:
        """
        Handles the action data export requested event.
        """
        etl_client = etl_client_factory()
        etl_client.import_data()
