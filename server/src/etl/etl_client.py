import datetime

import requests


class EtlClient:
    def __init__(self, etl_server_url: str):
        self.etl_server_url = etl_server_url

    def import_data(self):
        """
        Import data
        """
        response = requests.post(f"{self.etl_server_url}/import-data")
        response.raise_for_status()
        return response.json()

    def export_data(self, action_date: datetime.date, force: bool):
        """
        Export data
        :param action_date: Action date
        :param force: Force export
        """
        response = requests.post(
            f"{self.etl_server_url}/export-data",
            json={
                "action_date": action_date.strftime("%Y-%m-%d"),
                "force": force,
            },
        )
        response.raise_for_status()
        return response.json()

    @classmethod
    def from_env(cls):
        """
        Create ETL client from environment
        """
        from src.settings import get_settings

        settings = get_settings()
        return cls(etl_server_url=settings.etl_server_url)
