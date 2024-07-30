class EtlClient:
    def __init__(self, etl_server_url: str):
        self.etl_server_url = etl_server_url

    def etl(self, data: dict):
        response = requests.post(self.etl_server_url, json=data)
        response.raise_for_status()
        return response.json()
