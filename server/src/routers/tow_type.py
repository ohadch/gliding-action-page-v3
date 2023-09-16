from typing import List, Optional

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from src.app import app

from src.crud import TowTypeCrud
from src.database import get_db
from src.schemas import TowTypeSchema, TowTypeSearchSchema, TowTypeCreateSchema, TowTypeUpdateSchema
from src.settings import Settings, get_settings

crud = TowTypeCrud()
prefix = "tow_types"
tags = [prefix]


@app.post(
    f"/{prefix}/search",
    tags=tags,
    response_model=List[TowTypeSchema],
    summary=f"Search {prefix}",
)
async def search(
        page: int = 1,
        page_size: Optional[int] = None,
        filters: Optional[TowTypeSearchSchema] = None,
        db: Session = Depends(get_db),
        settings: Settings = Depends(get_settings),
):
    """
    Search tow_types
    :param page: Page number
    :param page_size: Page size
    :param filters: Filters
    :param db: Database session
    :param settings: Settings
    :return: List of tow_types
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
    response_model=TowTypeSchema,
    summary=f"Create {prefix}",
)
async def create(
        data: TowTypeCreateSchema, db: Session = Depends(get_db)
):
    """
    Create tow_type
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
    response_model=TowTypeSchema,
    summary=f"Get {prefix} by ID",
)
async def get_by_id(id_: int, db: Session = Depends(get_db)):
    """
    Read tow_type by ID
    :param id_: TowType ID
    :param db: Database session
    :return: TowType
    """
    tow_type = await crud.get_by_id(db=db, id_=id_)
    if not tow_type:
        raise HTTPException(status_code=404, detail=f"{prefix.title()} not found")
    return tow_type


@app.put(
    f"/{prefix}/{{id_}}",
    tags=tags,
    response_model=TowTypeSchema,
    summary=f"Update {prefix}",
)
async def update(
        id_: int,
        data: TowTypeUpdateSchema,
        db: Session = Depends(get_db),
):
    """
    Update tow_type
    :param id_: TowType ID
    :param data: Data to update
    :param db: Database session
    :return: Updated tow_type
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
    Delete tow_type
    :param id_: TowType ID
    :param db: Database session
    """
    crud.delete(db=db, id_=id_)
