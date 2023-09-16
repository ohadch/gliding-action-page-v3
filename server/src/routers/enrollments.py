from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.config.dependencies import get_db
from src.models import Enrollment
from src.schemas.enrollment import (
    EnrollmentSchema,
    EnrollmentCreateSchema,
    EnrollmentUpdateSchema,
)

router = APIRouter(
    prefix="/enrollments",
    tags=["enrollments"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=list[EnrollmentSchema])
async def read_enrollments(
    db: Session = Depends(get_db), member_id: int = None, course_id: int = None
):
    search_params = {}

    if member_id:
        search_params["member_id"] = member_id

    if course_id:
        search_params["course_id"] = course_id

    if search_params:
        return db.query(Enrollment).filter_by(**search_params).all()

    return db.query(Enrollment).all()


@router.get("/{enrollment_id}", response_model=EnrollmentSchema)
async def read_enrollment(enrollment_id: int, db: Session = Depends(get_db)):
    return db.query(Enrollment).get(enrollment_id)


@router.post("/", response_model=EnrollmentSchema)
async def create_enrollment(
    enrollment_schema: EnrollmentCreateSchema, db: Session = Depends(get_db)
):
    enrollment = Enrollment(**enrollment_schema.__dict__)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.put("/{enrollment_id}", response_model=EnrollmentSchema)
async def update_enrollment(
    enrollment_id: int,
    enrollment_schema: EnrollmentUpdateSchema,
    db: Session = Depends(get_db),
):
    enrollment = db.query(Enrollment).get(enrollment_id)
    for key, value in enrollment_schema.__dict__.items():
        setattr(enrollment, key, value)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.delete("/{enrollment_id}")
async def delete_enrollment(enrollment_id: int, db: Session = Depends(get_db)):
    enrollment = db.query(Enrollment).get(enrollment_id)
    db.delete(enrollment)
    db.commit()
    return {"message": "Enrollment deleted successfully."}
