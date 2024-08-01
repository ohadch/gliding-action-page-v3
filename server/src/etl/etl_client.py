import abc
import datetime
import logging


class EtlClient(abc.ABC):
    def __init__(self):
        self._logger = logging.getLogger(__name__)

    @abc.abstractmethod
    def import_data(self):
        """
        Import data
        """
        pass

    @abc.abstractmethod
    def export_data(self, action_date: datetime.date, force: bool):
        pass
