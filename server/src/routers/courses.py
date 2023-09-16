from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.config.dependencies import get_db
from src.models import Course, CourseSyllabus
from src.schemas.course import CourseSchema, CourseCreateSchema, CourseUpdateSchema
from src.schemas.course_syllabus import InstructionPlanSyllabusSchema
from src.schemas.syllabus import SyllabusSchema

router = APIRouter(
    prefix="/courses",
    tags=["courses"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=list[CourseSchema])
async def read_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()


@router.get("/{course_id}", response_model=CourseSchema)
async def read_course(course_id: int, db: Session = Depends(get_db)):
    return db.query(Course).get(course_id)


@router.get("/{course_id}/syllabuses", response_model=list[SyllabusSchema])
async def read_course_syllabuses(course_id: int, db: Session = Depends(get_db)):
    course_syllabuses_connections = db.query(CourseSyllabus).filter_by(
        course_id=course_id
    )

    return [
        course_syllabus_connection.syllabus
        for course_syllabus_connection in course_syllabuses_connections
    ]


@router.post("/{course_id}/syllabuses", response_model=InstructionPlanSyllabusSchema)
async def add_syllabus_to_course(
    course_id: int, syllabus_id: int, db: Session = Depends(get_db)
):
    course_syllabus = CourseSyllabus(
        course_id=course_id,
        syllabus_id=syllabus_id,
    )
    db.add(course_syllabus)
    db.commit()
    db.refresh(course_syllabus)
    return course_syllabus


@router.delete("/{course_id}/syllabuses")
async def remove_syllabus_from_course(
    course_id: int, syllabus_id: int, db: Session = Depends(get_db)
):
    course_syllabus = (
        db.query(CourseSyllabus)
        .filter_by(
            course_id=course_id,
            syllabus_id=syllabus_id,
        )
        .first()
    )
    db.delete(course_syllabus)
    db.commit()
    return {"message": "Syllabus removed from instruction plan successfully."}


@router.post("/", response_model=CourseSchema)
async def create_course(
    course_schema: CourseCreateSchema, db: Session = Depends(get_db)
):
    course = Course(**course_schema.__dict__)
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.put("/{course_id}", response_model=CourseSchema)
async def update_course(
    course_id: int, course_schema: CourseUpdateSchema, db: Session = Depends(get_db)
):
    course = db.query(Course).get(course_id)
    for key, value in course_schema.__dict__.items():
        setattr(course, key, value)
    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}")
async def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).get(course_id)
    db.delete(course)
    db.commit()
    return {"message": "Course deleted successfully."}
