import logging
import os
import zipfile
from datetime import datetime
from tempfile import TemporaryDirectory

from src import get_settings
from src.emails.email_client import EmailClient
from src.utils.common import run_subprocess


class PostgresBackupManager:
    def __init__(self, connection_url: str):
        self._logger = logging.getLogger(__name__)
        self._connection_url = connection_url

    @classmethod
    def from_env(cls) -> "PostgresBackupManager":
        settings = get_settings()
        return cls(connection_url=settings.sqlalchemy_db_uri)

    def backup(self, output_dir: str) -> str:
        """
        Backup the database to a ZIP file
        :param output_dir: Output directory
        :return: Path to the ZIP file
        """
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        zip_file = os.path.join(output_dir, f"backup_{timestamp}.zip")

        self._logger.info(f"Creating a backup of the database to {zip_file}")

        # Specifically, dump the flights table to a csv file.
        # Only dump the flights to avoid dumping sensitive data!
        dump_command = f"psql {self._connection_url} -c 'COPY flights TO STDOUT WITH CSV HEADER' > {output_dir}/flights.csv"
        run_subprocess(command=dump_command)

        # Zip the csv file
        with zipfile.ZipFile(zip_file, "w", zipfile.ZIP_DEFLATED) as zipf:
            zipf.write(f"{output_dir}/flights.csv", "flights.csv")

        self._logger.info(f"Database backup created at {zip_file}")

        return zip_file

    def backup_and_send_to_recipient(self):
        """
        Backup the database and send it to the assigned recipient
        """
        with TemporaryDirectory() as temp_dir:
            backup_path = self.backup(output_dir=temp_dir)
            settings = get_settings()
            email_client = EmailClient()
            email_client.send_email(
                to_email=settings.database_backup_recipient_email,
                subject=f"Database Backup - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
                html_content="Please find the database backup attached.",
                attachment_path=backup_path,
            )
