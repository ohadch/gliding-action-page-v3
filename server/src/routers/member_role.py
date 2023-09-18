from typing import List, Optional

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from src.app import app

from src.crud import MemberRoleCrud
from src.database import get_db
from src.schemas import (
    MemberRoleSchema,
    MemberRoleSearchSchema,
    MemberRoleCreateSchema,
    MemberRoleUpdateSchema,
)
from src.settings import Settings, get_settings

crud = MemberRoleCrud()
prefix = "member_roles"
tags = [prefix]


@app.post(
    f"/{prefix}/search",
    tags=tags,
    response_model=List[MemberRoleSchema],
    summary=f"Search {prefix}",
)
async def search(
    page: int = 1,
    page_size: Optional[int] = None,
    filters: Optional[MemberRoleSearchSchema] = None,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    """
    Search member_roles
    :param page: Page number
    :param page_size: Page size
    :param filters: Filters
    :param db: Database session
    :param settings: Settings
    :return: List of member_roles
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
    response_model=MemberRoleSchema,
    summary=f"Create {prefix}",
)
async def create(data: MemberRoleCreateSchema, db: Session = Depends(get_db)):
    """
    Create member_role
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
    response_model=MemberRoleSchema,
    summary=f"Get {prefix} by ID",
)
async def get_by_id(id_: int, db: Session = Depends(get_db)):
    """
    Read member_role by ID
    :param id_: MemberRole ID
    :param db: Database session
    :return: MemberRole
    """
    member_role = await crud.get_by_id(db=db, id_=id_)
    if not member_role:
        raise HTTPException(status_code=404, detail=f"{prefix.title()} not found")
    return member_role


@app.put(
    f"/{prefix}/{{id_}}",
    tags=tags,
    response_model=MemberRoleSchema,
    summary=f"Update {prefix}",
)
async def update(
    id_: int,
    data: MemberRoleUpdateSchema,
    db: Session = Depends(get_db),
):
    """
    Update member_role
    :param id_: MemberRole ID
    :param data: Data to update
    :param db: Database session
    :return: Updated member_role
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
    Delete member_role
    :param id_: MemberRole ID
    :param db: Database session
    """
    crud.delete(db=db, id_=id_)
