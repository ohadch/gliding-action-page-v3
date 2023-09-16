from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.config.dependencies import get_db
from src.models import Syllabus
from src.schemas.syllabus import (
    SyllabusSchema,
    SyllabusCreateSchema,
    SyllabusUpdateSchema,
)

router = APIRouter(
    prefix="/syllabuses",
    tags=["syllabuses"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=list[SyllabusSchema])
async def read_syllabuses(db: Session = Depends(get_db)):
    return db.query(Syllabus).all()


@router.get("/{syllabus_id}", response_model=SyllabusSchema)
async def read_syllabus(syllabus_id: int, db: Session = Depends(get_db)):
    return db.query(Syllabus).get(syllabus_id)


@router.post("/", response_model=SyllabusSchema)
async def create_syllabus(
    syllabus_schema: SyllabusCreateSchema, db: Session = Depends(get_db)
):
    syllabus = Syllabus(**syllabus_schema.__dict__)
    db.add(syllabus)
    db.commit()
    db.refresh(syllabus)
    return syllabus


@router.put("/{syllabus_id}", response_model=SyllabusSchema)
async def update_syllabus(
    syllabus_id: int,
    syllabus_schema: SyllabusUpdateSchema,
    db: Session = Depends(get_db),
):
    syllabus = db.query(Syllabus).get(syllabus_id)
    for key, value in syllabus_schema.__dict__.items():
        setattr(syllabus, key, value)
    db.commit()
    db.refresh(syllabus)
    return syllabus


@router.delete("/{syllabus_id}")
async def delete_syllabus(syllabus_id: int, db: Session = Depends(get_db)):
    syllabus = db.query(Syllabus).get(syllabus_id)
    db.delete(syllabus)
    db.commit()
    return {"message": "Syllabus deleted successfully."}
