import os

from src.i18n.hebrew_i18n_client import HebrewI18nClient
from src.i18n.i18n_client import I18nClient
from src.utils.enums import Language


def i18n_client_factory() -> I18nClient:
    """
    Factory method for creating an I18nClient instance
    :return: I18nClient instance
    """
    language = Language(os.getenv("LANGUAGE", "he"))

    return {
        Language.Hebrew: lambda: HebrewI18nClient(),
    }[language]()
