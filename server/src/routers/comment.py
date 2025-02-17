from typing import List, Optional

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from src.app import app

from src.crud import CommentCrud
from src.database import get_db
from src.schemas import (
    CommentSchema,
    CommentSearchSchema,
    CommentCreateSchema,
    CommentUpdateSchema,
)
from src.settings import Settings, get_settings

crud = CommentCrud()
prefix = "comments"
tags = [prefix]


@app.post(
    f"/{prefix}/search",
    tags=tags,
    response_model=List[CommentSchema],
    summary=f"Search {prefix}",
)
def search(
    page: int = 1,
    page_size: Optional[int] = None,
    filters: Optional[CommentSearchSchema] = None,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    """
    Search comments
    :param page: Page number
    :param page_size: Page size
    :param filters: Filters
    :param db: Database session
    :param settings: Settings
    :return: List of comments
    """
    return crud.search(
        db=db,
        filters=filters,
        page=page,
        page_size=page_size or settings.default_page_size,
    )


@app.post(
    f"/{prefix}",
    tags=tags,
    response_model=CommentSchema,
    summary=f"Create {prefix}",
)
def create(data: CommentCreateSchema, db: Session = Depends(get_db)):
    """
    Create comment
    :param data: Data
    :param db: Database session
    """
    return crud.create(
        db=db,
        data=data,
    )


@app.get(
    f"/{prefix}/{{id_}}",
    tags=tags,
    response_model=CommentSchema,
    summary=f"Get {prefix} by ID",
)
def get_by_id(id_: int, db: Session = Depends(get_db)):
    """
    Read comment by ID
    :param id_: Comment ID
    :param db: Database session
    :return: Comment
    """
    comment = crud.get_by_id(db=db, id_=id_)
    if not comment:
        raise HTTPException(status_code=404, detail=f"{prefix.title()} not found")
    return comment


@app.put(
    f"/{prefix}/{{id_}}",
    tags=tags,
    response_model=CommentSchema,
    summary=f"Update {prefix}",
)
def update(
    id_: int,
    data: CommentUpdateSchema,
    db: Session = Depends(get_db),
):
    """
    Update comment
    :param id_: Comment ID
    :param data: Data to update
    :param db: Database session
    :return: Updated comment
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
def delete(id_: int, db: Session = Depends(get_db)):
    """
    Delete comment
    :param id_: Comment ID
    :param db: Database session
    """
    crud.delete(db=db, id_=id_)
