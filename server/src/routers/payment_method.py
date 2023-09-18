from typing import List, Optional

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from src.app import app

from src.crud import PaymentMethodCrud
from src.database import get_db
from src.schemas import (
    PaymentMethodSchema,
    PaymentMethodSearchSchema,
    PaymentMethodCreateSchema,
    PaymentMethodUpdateSchema,
)
from src.settings import Settings, get_settings

crud = PaymentMethodCrud()
prefix = "payment_methods"
tags = [prefix]


@app.post(
    f"/{prefix}/search",
    tags=tags,
    response_model=List[PaymentMethodSchema],
    summary=f"Search {prefix}",
)
async def search(
    page: int = 1,
    page_size: Optional[int] = None,
    filters: Optional[PaymentMethodSearchSchema] = None,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    """
    Search payment_methods
    :param page: Page number
    :param page_size: Page size
    :param filters: Filters
    :param db: Database session
    :param settings: Settings
    :return: List of payment_methods
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
    response_model=PaymentMethodSchema,
    summary=f"Create {prefix}",
)
async def create(data: PaymentMethodCreateSchema, db: Session = Depends(get_db)):
    """
    Create payment_method
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
    response_model=PaymentMethodSchema,
    summary=f"Get {prefix} by ID",
)
async def get_by_id(id_: int, db: Session = Depends(get_db)):
    """
    Read payment_method by ID
    :param id_: PaymentMethod ID
    :param db: Database session
    :return: PaymentMethod
    """
    payment_method = await crud.get_by_id(db=db, id_=id_)
    if not payment_method:
        raise HTTPException(status_code=404, detail=f"{prefix.title()} not found")
    return payment_method


@app.put(
    f"/{prefix}/{{id_}}",
    tags=tags,
    response_model=PaymentMethodSchema,
    summary=f"Update {prefix}",
)
async def update(
    id_: int,
    data: PaymentMethodUpdateSchema,
    db: Session = Depends(get_db),
):
    """
    Update payment_method
    :param id_: PaymentMethod ID
    :param data: Data to update
    :param db: Database session
    :return: Updated payment_method
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
    Delete payment_method
    :param id_: PaymentMethod ID
    :param db: Database session
    """
    crud.delete(db=db, id_=id_)
