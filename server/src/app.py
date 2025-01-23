from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware

load_dotenv()

import logging

from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi_route_logger_middleware import RouteLoggerMiddleware


from src.database import SessionLocal

app = FastAPI(
    title="Gliding Action Page API",
    description="Gliding Action Page API is a REST API for the Gliding Action Page.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


logger = logging.getLogger("app")

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(RouteLoggerMiddleware)


@app.on_event("startup")
def startup():
    # hook startup event to connect to database for example
    # database.connect()
    logger.debug("Application startup", extra={})


@app.on_event("shutdown")
def shutdown():
    # hook startup event to disconnect from database for example
    # database.disconnect()
    logger.debug("Application shutdown", extra={})


@app.get("/health")
def health():
    return {"status": "ok"}
