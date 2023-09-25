from typing import List, Optional

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from src.app import app

from src.crud import EventCrud
from src.database import get_db
from src.schemas import (
    EventSchema,
    EventSearchSchema,
    EventCreateSchema,
    EventUpdateSchema,
)
from src.settings import Settings, get_settings

crud = EventCrud()
prefix = "events"
tags = [prefix]


@app.post(
    f"/{prefix}/search",
    tags=tags,
    response_model=List[EventSchema],
    summary=f"Search {prefix}",
)
async def search(
    page: int = 1,
    page_size: Optional[int] = None,
    filters: Optional[EventSearchSchema] = None,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    """
    Search events
    :param page: Page number
    :param page_size: Page size
    :param filters: Filters
    :param db: Database session
    :param settings: Settings
    :return: List of events
    """
    return await crud.search(
        db=db,
        filters=filters,
        page=page,
        page_size=page_size or settings.default_page_size,
    )


@app.post(
    f"/{prefix}",
    tags=tags,
    response_model=EventSchema,
    summary=f"Create {prefix}",
)
async def create(data: EventCreateSchema, db: Session = Depends(get_db)):
    """
    Create event
    :param data: Data
    :param db: Database session
    """
    return await crud.create(
        db=db,
        data=data,
    )


@app.get(
    f"/{prefix}/{{id_}}",
    tags=tags,
    response_model=EventSchema,
    summary=f"Get {prefix} by ID",
)
async def get_by_id(id_: int, db: Session = Depends(get_db)):
    """
    Read event by ID
    :param id_: Event ID
    :param db: Database session
    :return: Event
    """
    event = await crud.get_by_id(db=db, id_=id_)
    if not event:
        raise HTTPException(status_code=404, detail=f"{prefix.title()} not found")
    return event


@app.put(
    f"/{prefix}/{{id_}}",
    tags=tags,
    response_model=EventSchema,
    summary=f"Update {prefix}",
)
async def update(
    id_: int,
    data: EventUpdateSchema,
    db: Session = Depends(get_db),
):
    """
    Update event
    :param id_: Event ID
    :param data: Data to update
    :param db: Database session
    :return: Updated event
    """
    return crud.update(
        db=db,
        id_=id_,
        data=data,
    )


@app.delete(
    f"/{prefix}/{{id_}}",
    tags=tags,
    summary=f"Delete {prefix}",
)
async def delete(id_: int, db: Session = Depends(get_db)):
    """
    Delete event
    :param id_: Event ID
    :param db: Database session
    """
    crud.delete(db=db, id_=id_)
