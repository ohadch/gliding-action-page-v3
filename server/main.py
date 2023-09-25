import logging
import threading

from dotenv import load_dotenv

from src.notifications.notifications_consumer import NotificationsConsumer

load_dotenv()

import uvicorn

from src.settings import get_settings
from src.seed import SeedDataGenerator
from src.database import SessionLocal

logger = logging.getLogger(__name__)

if __name__ == "__main__":
    settings = get_settings()

    if settings.create_seed_data:
        logger.info("Creating seed data")
        seed = SeedDataGenerator(
            session=SessionLocal(),
        )
        seed.create_seed_data()

    # Notifications consumer thread
    notifications_consumer = NotificationsConsumer(interval_seconds=10)
    notifications_consumer_thread = threading.Thread(
        target=notifications_consumer.run, daemon=True
    ).start()

    # Uvicorn thread
    uvicorn.run("src:app", host="0.0.0.0", port=settings.port, reload=True)
