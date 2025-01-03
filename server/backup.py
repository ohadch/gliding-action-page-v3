from dotenv import load_dotenv

load_dotenv()

from src.utils.backup import PostgresBackupManager


if __name__ == "__main__":
    backup_manager = PostgresBackupManager.from_env()
    backup_manager.backup_and_send_to_recipient()
