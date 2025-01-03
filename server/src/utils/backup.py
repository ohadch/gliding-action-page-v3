import logging
import os
import zipfile
from datetime import datetime
from sqlalchemy import Engine

from src.utils.common import run_subprocess


class PostgresBackupManager:
    def __init__(self, engine: Engine):
        self._logger = logging.getLogger(__name__)
        self._engine = engine

    def backup(self, output_dir: str) -> str:
        """
        Backup the database to a ZIP file
        :param output_dir: Output directory
        :return: Path to the ZIP file
        """
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        backup_file = os.path.join(output_dir, f"backup_{timestamp}.sql")
        zip_file = os.path.join(output_dir, f"backup_{timestamp}.zip")

        self._logger.info(f"Creating a backup of the database to {zip_file}")

        # Dump the database to a SQL file
        dump_command = f"pg_dump {self._engine.url} > {backup_file}"
        run_subprocess(command=dump_command)

        # Zip the SQL file
        with zipfile.ZipFile(zip_file, "w", zipfile.ZIP_DEFLATED) as zipf:
            zipf.write(backup_file, os.path.basename(backup_file))

        # Remove the SQL file after zipping
        os.remove(backup_file)

        self._logger.info(f"Database backup created at {zip_file}")

        return zip_file
