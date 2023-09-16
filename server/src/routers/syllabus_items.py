from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.config.dependencies import get_db
from src.models import Syllabus, SyllabusItem
from src.schemas.syllabus_item import (
    SyllabusItemSchema,
    SyllabusItemCreateSchema,
    SyllabusItemUpdateSchema,
)

router = APIRouter(
    prefix="/syllabuses/{syllabus_id}/items",
    tags=["syllabuses"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=list[SyllabusItemSchema])
async def read_syllabus_items(syllabus_id: int, db: Session = Depends(get_db)):
    syllabus = db.query(Syllabus).get(syllabus_id)
    return syllabus.items


@router.get("/{item_id}", response_model=SyllabusItemSchema)
async def read_syllabus_item(
    syllabus_id: int, item_id: int, db: Session = Depends(get_db)
):
    syllabus = db.query(Syllabus).get(syllabus_id)
    return syllabus.items.get(item_id)


@router.post("/", response_model=SyllabusItemSchema)
async def create_syllabus_item(
    syllabus_id: int,
    syllabus_item_schema: SyllabusItemCreateSchema,
    db: Session = Depends(get_db),
):
    syllabus_item = SyllabusItem()
    syllabus_item.syllabus_id = syllabus_id
    for key, value in syllabus_item_schema.__dict__.items():
        setattr(syllabus_item, key, value)
    db.add(syllabus_item)
    db.commit()
    db.refresh(syllabus_item)
    return syllabus_item


@router.put("/{item_id}", response_model=SyllabusItemSchema)
async def update_syllabus_item(
    syllabus_id: int,
    item_id: int,
    syllabus_item_schema: SyllabusItemUpdateSchema,
    db: Session = Depends(get_db),
):
    syllabus = db.query(Syllabus).get(syllabus_id)
    syllabus_item = db.query(SyllabusItem).get(item_id)

    for key, value in syllabus_item_schema.__dict__.items():
        setattr(syllabus_item, key, value)

    db.commit()
    db.refresh(syllabus_item)
    return syllabus_item


@router.delete("/{item_id}")
async def delete_syllabus_item(
    syllabus_id: int, item_id: int, db: Session = Depends(get_db)
):
    db.query(SyllabusItem).filter(SyllabusItem.id == item_id).delete()
    db.commit()
    return {"message": "Syllabus item deleted successfully."}
