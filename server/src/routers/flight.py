from typing import List, Optional

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from src.app import app

from src.crud import FlightCrud
from src.database import get_db
from src.schemas import FlightSchema, FlightSearchSchema, FlightCreateSchema, FlightUpdateSchema
from src.settings import Settings, get_settings

crud = FlightCrud()
prefix = "flights"
tags = [prefix]


@app.post(
    f"/{prefix}/search",
    tags=tags,
    response_model=List[FlightSchema],
    summary=f"Search {prefix}",
)
async def search(
        page: int = 1,
        page_size: Optional[int] = None,
        filters: Optional[FlightSearchSchema] = None,
        db: Session = Depends(get_db),
        settings: Settings = Depends(get_settings),
):
    """
    Search flights
    :param page: Page number
    :param page_size: Page size
    :param filters: Filters
    :param db: Database session
    :param settings: Settings
    :return: List of flights
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
    response_model=FlightSchema,
    summary=f"Create {prefix}",
)
async def create(
        data: FlightCreateSchema, db: Session = Depends(get_db)
):
    """
    Create flight
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
    response_model=FlightSchema,
    summary=f"Get {prefix} by ID",
)
async def get_by_id(id_: int, db: Session = Depends(get_db)):
    """
    Read flight by ID
    :param id_: Flight ID
    :param db: Database session
    :return: Flight
    """
    flight = await crud.get_by_id(db=db, id_=id_)
    if not flight:
        raise HTTPException(status_code=404, detail=f"{prefix.title()} not found")
    return flight


@app.put(
    f"/{prefix}/{{id_}}",
    tags=tags,
    response_model=FlightSchema,
    summary=f"Update {prefix}",
)
async def update(
        id_: int,
        data: FlightUpdateSchema,
        db: Session = Depends(get_db),
):
    """
    Update flight
    :param id_: Flight ID
    :param data: Data to update
    :param db: Database session
    :return: Updated flight
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
    Delete flight
    :param id_: Flight ID
    :param db: Database session
    """
    crud.delete(db=db, id_=id_)
