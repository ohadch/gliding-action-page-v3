from typing import Optional

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    version: str
    sqlalchemy_db_uri: str
    port: int
    default_page_size: int
    create_seed_data: bool = True
    default_notification_method: str = "email"
    sendgrid_api_key: str
    sender_email: str
    etl_server_url: Optional[str] = None
    database_backup_recipient_email: str
    migrate_on_start: bool = True


@lru_cache()
def get_settings():
    return Settings()
