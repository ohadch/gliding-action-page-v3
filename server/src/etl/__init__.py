from src.etl.etl_client import EtlClient
from src.etl.mock_etl_client import MockEtlClient


def etl_client_factory() -> EtlClient:
    """
    ETL client factory
    """
    from src.settings import get_settings

    # Importing here to avoid circular imports
    from src.etl.mock_etl_client import MockEtlClient
    from src.etl.rest_etl_client import RestEtlClient

    settings = get_settings()
    if settings.etl_server_disabled:
        etl_client = MockEtlClient()
    else:
        etl_client = RestEtlClient(etl_server_url=settings.etl_server_url)

    return etl_client
