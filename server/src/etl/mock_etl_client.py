import datetime

from src.etl import EtlClient


class MockEtlClient(EtlClient):
    def import_data(self):
        """
        Import data
        """
        self._logger.warning("Mock import data")
        return {"status": "success"}

    def export_data(self, action_date: datetime.date, force: bool):
        """
        Export data
        :param action_date: Action date
        :param force: Force export
        """
        self._logger.warning(
            f"Mock export data for action date {action_date}, force={force}"
        )
        return {"status": "success"}
