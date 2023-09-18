from typing import List, Optional

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from src.app import app

from src.crud import GliderCrud
from src.database import get_db
from src.schemas import (
    GliderSchema,
    GliderSearchSchema,
    GliderCreateSchema,
    GliderUpdateSchema,
)
from src.settings import Settings, get_settings

crud = GliderCrud()
prefix = "gliders"
tags = [prefix]


@app.post(
    f"/{prefix}/search",
    tags=tags,
    response_model=List[GliderSchema],
    summary=f"Search {prefix}",
)
async def search(
    page: int = 1,
    page_size: Optional[int] = None,
    filters: Optional[GliderSearchSchema] = None,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    """
    Search gliders
    :param page: Page number
    :param page_size: Page size
    :param filters: Filters
    :param db: Database session
    :param settings: Settings
    :return: List of gliders
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
    response_model=GliderSchema,
    summary=f"Create {prefix}",
)
async def create(data: GliderCreateSchema, db: Session = Depends(get_db)):
    """
    Create glider
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
    response_model=GliderSchema,
    summary=f"Get {prefix} by ID",
)
async def get_by_id(id_: int, db: Session = Depends(get_db)):
    """
    Read glider by ID
    :param id_: Glider ID
    :param db: Database session
    :return: Glider
    """
    glider = await crud.get_by_id(db=db, id_=id_)
    if not glider:
        raise HTTPException(status_code=404, detail=f"{prefix.title()} not found")
    return glider


@app.put(
    f"/{prefix}/{{id_}}",
    tags=tags,
    response_model=GliderSchema,
    summary=f"Update {prefix}",
)
async def update(
    id_: int,
    data: GliderUpdateSchema,
    db: Session = Depends(get_db),
):
    """
    Update glider
    :param id_: Glider ID
    :param data: Data to update
    :param db: Database session
    :return: Updated glider
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
    Delete glider
    :param id_: Glider ID
    :param db: Database session
    """
    crud.delete(db=db, id_=id_)
