from typing import List, Optional

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from src.app import app

from src.crud import ActiveTowAirplaneCrud
from src.database import get_db
from src.schemas import ActiveTowAirplaneSchema, ActiveTowAirplaneSearchSchema, ActiveTowAirplaneCreateSchema, ActiveTowAirplaneUpdateSchema
from src.settings import Settings, get_settings

crud = ActiveTowAirplaneCrud()
prefix = "active_tow_airplanes"
tags = [prefix]


@app.post(
    f"/{prefix}/search",
    tags=tags,
    response_model=List[ActiveTowAirplaneSchema],
    summary=f"Search {prefix}",
)
async def search(
        page: int = 1,
        page_size: Optional[int] = None,
        filters: Optional[ActiveTowAirplaneSearchSchema] = None,
        db: Session = Depends(get_db),
        settings: Settings = Depends(get_settings),
):
    """
    Search active_tow_airplanes
    :param page: Page number
    :param page_size: Page size
    :param filters: Filters
    :param db: Database session
    :param settings: Settings
    :return: List of active_tow_airplanes
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
    response_model=ActiveTowAirplaneSchema,
    summary=f"Create {prefix}",
)
async def create(
        data: ActiveTowAirplaneCreateSchema, db: Session = Depends(get_db)
):
    """
    Create active_tow_airplane
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
    response_model=ActiveTowAirplaneSchema,
    summary=f"Get {prefix} by ID",
)
async def get_by_id(id_: int, db: Session = Depends(get_db)):
    """
    Read active_tow_airplane by ID
    :param id_: ActiveTowAirplane ID
    :param db: Database session
    :return: ActiveTowAirplane
    """
    active_tow_airplane = await crud.get_by_id(db=db, id_=id_)
    if not active_tow_airplane:
        raise HTTPException(status_code=404, detail=f"{prefix.title()} not found")
    return active_tow_airplane


@app.put(
    f"/{prefix}/{{id_}}",
    tags=tags,
    response_model=ActiveTowAirplaneSchema,
    summary=f"Update {prefix}",
)
async def update(
        id_: int,
        data: ActiveTowAirplaneUpdateSchema,
        db: Session = Depends(get_db),
):
    """
    Update active_tow_airplane
    :param id_: ActiveTowAirplane ID
    :param data: Data to update
    :param db: Database session
    :return: Updated active_tow_airplane
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
    Delete active_tow_airplane
    :param id_: ActiveTowAirplane ID
    :param db: Database session
    """
    crud.delete(db=db, id_=id_)
