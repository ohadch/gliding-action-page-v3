from typing import List, Optional

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from src.app import app

from src.crud import EmailCrud
from src.database import get_db
from src.schemas import EmailSchema, EmailSearchSchema, EmailCreateSchema, EmailUpdateSchema
from src.settings import Settings, get_settings

crud = EmailCrud()
prefix = "emails"
tags = [prefix]


@app.post(
    f"/{prefix}/search",
    tags=tags,
    response_model=List[EmailSchema],
    summary=f"Search {prefix}",
)
async def search(
        page: int = 1,
        page_size: Optional[int] = None,
        filters: Optional[EmailSearchSchema] = None,
        db: Session = Depends(get_db),
        settings: Settings = Depends(get_settings),
):
    """
    Search emails
    :param page: Page number
    :param page_size: Page size
    :param filters: Filters
    :param db: Database session
    :param settings: Settings
    :return: List of emails
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
    response_model=EmailSchema,
    summary=f"Create {prefix}",
)
async def create(
        data: EmailCreateSchema, db: Session = Depends(get_db)
):
    """
    Create email
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
    response_model=EmailSchema,
    summary=f"Get {prefix} by ID",
)
async def get_by_id(id_: int, db: Session = Depends(get_db)):
    """
    Read email by ID
    :param id_: Email ID
    :param db: Database session
    :return: Email
    """
    email = await crud.get_by_id(db=db, id_=id_)
    if not email:
        raise HTTPException(status_code=404, detail=f"{prefix.title()} not found")
    return email


@app.put(
    f"/{prefix}/{{id_}}",
    tags=tags,
    response_model=EmailSchema,
    summary=f"Update {prefix}",
)
async def update(
        id_: int,
        data: EmailUpdateSchema,
        db: Session = Depends(get_db),
):
    """
    Update email
    :param id_: Email ID
    :param data: Data to update
    :param db: Database session
    :return: Updated email
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
    Delete email
    :param id_: Email ID
    :param db: Database session
    """
    crud.delete(db=db, id_=id_)
