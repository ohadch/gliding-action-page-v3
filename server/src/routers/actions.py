from typing import List, Optional
from uuid import UUID

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app import app, crud
from lynx_api_client import schema
from app.app import get_db
from app.settings import get_settings, Settings


@app.post(
    "/actions/search",
    tags=["actions"],
    response_model=List[schema.ActionSchema],
    summary="Search actions",
)
async def search_actions(
    page: int = 1,
    page_size: Optional[int] = None,
    filters: Optional[schema.ActionSchemaSearch] = None,
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
    return await crud.ActionCrud().search(
        db=db,
        filters=filters,
        page=page,
        page_size=page_size or settings.default_page_size,
    )


@app.post(
    "/actions",
    tags=["actions"],
    response_model=schema.ActionSchema,
    summary="Create action",
)
async def create_action(
    action: schema.ActionSchemaCreate, db: Session = Depends(get_db)
):
    """
    Create action
    :param action: Action data
    :param db: Database session
    """
    return await crud.ActionCrud().create(
        db=db,
        data=action,
    )


@app.get(
    "/actions/{action_id}",
    tags=["actions"],
    response_model=schema.ActionSchema,
    summary="Get action by ID",
)
async def get_action_by_id(action_id: UUID, db: Session = Depends(get_db)):
    """
    Read action by ID
    :param action_id: Action ID
    :param db: Database session
    :return: Action
    """
    action = await crud.ActionCrud().get_by_id(db=db, id_=action_id)
    if not action:
        raise HTTPException(status_code=404, detail="Action not found")
    return action


@app.put(
    "/actions/{action_id}",
    tags=["actions"],
    response_model=schema.ActionSchema,
    summary="Update action",
)
async def update_action(
    action_id: UUID,
    action: schema.ActionSchemaUpdate,
    db: Session = Depends(get_db),
):
    """
    Update action
    :param action_id: Action ID
    :param action: Action data to update
    :param db: Database session
    :return: Updated action
    """
    return await crud.ActionCrud().update(
        db=db,
        id_=action_id,
        data=action,
    )


@app.delete(
    "/actions/{action_id}",
    tags=["actions"],
    summary="Delete action",
)
async def delete_action(action_id: UUID, db: Session = Depends(get_db)):
    """
    Delete action
    :param action_id: Action ID
    :param db: Database session
    """
    await crud.ActionCrud().delete(db=db, id_=action_id)
