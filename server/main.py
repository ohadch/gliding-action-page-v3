# This has to be at the top always
import os

from dotenv import load_dotenv

load_dotenv()

import logging
import threading


from src.events.events_consumer import EventsConsumer
from src.notifications.notifications_consumer import NotificationsConsumer

import uvicorn

from src.settings import get_settings
from src.seed import SeedDataGenerator
from src.database import SessionLocal

logger = logging.getLogger(__name__)


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s", force=True
    )

    settings = get_settings()

    if settings.migrate_on_start:
        os.system("make migrate")

    if settings.create_seed_data:
        logger.info("Creating seed data")
        seed = SeedDataGenerator(
            session=SessionLocal(),
        )
        seed.create_seed_data()

    # Notifications consumer thread
    notifications_consumer = NotificationsConsumer(interval_seconds=5)
    notifications_consumer_thread = threading.Thread(
        target=notifications_consumer.run, daemon=True
    ).start()

    # Events consumer thread
    events_consumer = EventsConsumer(interval_seconds=5)
    events_consumer_thread = threading.Thread(
        target=events_consumer.run, daemon=True
    ).start()

    # Uvicorn thread
    uvicorn.run(
        "src:app", host="0.0.0.0", port=settings.port, reload=True, proxy_headers=True
    )
