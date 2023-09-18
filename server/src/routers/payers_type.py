from typing import List, Optional

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from src.app import app

from src.crud import PayersTypeCrud
from src.database import get_db
from src.schemas import (
    PayersTypeSchema,
    PayersTypeSearchSchema,
    PayersTypeCreateSchema,
    PayersTypeUpdateSchema,
)
from src.settings import Settings, get_settings

crud = PayersTypeCrud()
prefix = "payers_types"
tags = [prefix]


@app.post(
    f"/{prefix}/search",
    tags=tags,
    response_model=List[PayersTypeSchema],
    summary=f"Search {prefix}",
)
async def search(
    page: int = 1,
    page_size: Optional[int] = None,
    filters: Optional[PayersTypeSearchSchema] = None,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    """
    Search payers_types
    :param page: Page number
    :param page_size: Page size
    :param filters: Filters
    :param db: Database session
    :param settings: Settings
    :return: List of payers_types
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
    response_model=PayersTypeSchema,
    summary=f"Create {prefix}",
)
async def create(data: PayersTypeCreateSchema, db: Session = Depends(get_db)):
    """
    Create payers_type
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
    response_model=PayersTypeSchema,
    summary=f"Get {prefix} by ID",
)
async def get_by_id(id_: int, db: Session = Depends(get_db)):
    """
    Read payers_type by ID
    :param id_: PayersType ID
    :param db: Database session
    :return: PayersType
    """
    payers_type = await crud.get_by_id(db=db, id_=id_)
    if not payers_type:
        raise HTTPException(status_code=404, detail=f"{prefix.title()} not found")
    return payers_type


@app.put(
    f"/{prefix}/{{id_}}",
    tags=tags,
    response_model=PayersTypeSchema,
    summary=f"Update {prefix}",
)
async def update(
    id_: int,
    data: PayersTypeUpdateSchema,
    db: Session = Depends(get_db),
):
    """
    Update payers_type
    :param id_: PayersType ID
    :param data: Data to update
    :param db: Database session
    :return: Updated payers_type
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
    Delete payers_type
    :param id_: PayersType ID
    :param db: Database session
    """
    crud.delete(db=db, id_=id_)
