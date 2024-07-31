import datetime

import requests

from src.etl.etl_client import EtlClient


class RestEtlClient(EtlClient):
    def __init__(self, etl_server_url: str):
        super().__init__()
        self.etl_server_url = etl_server_url

    def import_data(self):
        """
        Import data
        """
        self._logger.info("Importing data")
        response = requests.post(f"{self.etl_server_url}/import-data")
        response.raise_for_status()
        self._logger.info(f"Import data response: {response.json()}")
        return response.json()

    def export_data(self, action_date: datetime.date, force: bool):
        """
        Export data
        :param action_date: Action date
        :param force: Force export
        """
        self._logger.info(
            f"Exporting data for action date {action_date}, force={force}"
        )
        response = requests.post(
            f"{self.etl_server_url}/export-data",
            json={
                "action_date": action_date.strftime("%Y-%m-%d"),
                "force": force,
            },
        )
        response.raise_for_status()
        self._logger.info(f"Export data response: {response.json()}")
        return response.json()

    @classmethod
    def from_env(cls):
        """
        Create ETL client from environment
        """
        from src.settings import get_settings

        settings = get_settings()
        return cls(etl_server_url=settings.etl_server_url)
