from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware

load_dotenv()

import logging
import time

from fastapi import FastAPI, Request
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


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


@app.on_event("startup")
async def startup():
    # hook startup event to connect to database for example
    # await database.connect()
    logger.debug("Application startup", extra={})


@app.on_event("shutdown")
async def shutdown():
    # hook startup event to disconnect from database for example
    # await database.disconnect()
    logger.debug("Application shutdown", extra={})
