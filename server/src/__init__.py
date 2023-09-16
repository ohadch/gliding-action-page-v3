import logging.config
import os

logging.config.fileConfig(
    os.path.join(os.path.dirname(__file__), "..", "logging_config.ini")
)
from .app import app
from .models import *
from .routers import *
