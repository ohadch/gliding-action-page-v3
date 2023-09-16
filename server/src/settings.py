from pydantic import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    version: str
    sqlalchemy_db_uri: str
    port: int
    default_page_size: int
    create_seed_data: bool = True


@lru_cache()
def get_settings():
    return Settings()
