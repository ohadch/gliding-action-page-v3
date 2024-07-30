from typing import List, Optional

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from src.app import app

from src.crud import ActionCrud
from src.database import get_db
from src.schemas import (
    ActionSchema,
    ActionSearchSchema,
    ActionCreateSchema,
    ActionUpdateSchema,
)
from src.settings import Settings, get_settings

crud = ActionCrud()
prefix = "actions"
tags = [prefix]


@app.post(
    f"/{prefix}/search",
    tags=tags,
    response_model=List[ActionSchema],
    summary=f"Search {prefix}",
)
async def search(
    page: int = 1,
    page_size: Optional[int] = None,
    filters: Optional[ActionSearchSchema] = None,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    """
    Search actions
    :param page: Page number
    :param page_size: Page size
    :param filters: Filters
    :param db: Database session
    :param settings: Settings
    :return: List of actions
    """
    items = await crud.search(
        db=db,
        filters=filters,
        page=page,
        page_size=page_size or settings.default_page_size,
        order_by="date",
        ascending=True,
    )
    return items


@app.post(
    f"/{prefix}",
    tags=tags,
    response_model=ActionSchema,
    summary=f"Create {prefix}",
)
async def create(data: ActionCreateSchema, db: Session = Depends(get_db)):
    """
    Create action
    :param data: Data
    :param db: Database session
    """
    return await crud.create(
        db=db,
        data=data,
    )


@app.post(
    f"/{prefix}/{{id_}}/export",
    tags=tags,
    summary=f"Export {prefix}",
)
async def export(
    db: Session = Depends(get_db),
):
    """
    Export an action
    :param db: Database session
    """


@app.get(
    f"/{prefix}/{{id_}}",
    tags=tags,
    response_model=ActionSchema,
    summary=f"Get {prefix} by ID",
)
async def get_by_id(id_: int, db: Session = Depends(get_db)):
    """
    Read action by ID
    :param id_: Action ID
    :param db: Database session
    :return: Action
    """
    action = await crud.get_by_id(db=db, id_=id_)
    if not action:
        raise HTTPException(status_code=404, detail=f"{prefix.title()} not found")
    return action


@app.put(
    f"/{prefix}/{{id_}}",
    tags=tags,
    response_model=ActionSchema,
    summary=f"Update {prefix}",
)
async def update(
    id_: int,
    data: ActionUpdateSchema,
    db: Session = Depends(get_db),
):
    """
    Update action
    :param id_: Action ID
    :param data: Data to update
    :param db: Database session
    :return: Updated action
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
    Delete action
    :param id_: Action ID
    :param db: Database session
    """
    crud.delete(db=db, id_=id_)
