from pydantic import BaseModel, Field

from src.models.enrollment import EnrollmentStatus


class EnrollmentSchema(BaseModel):
    id: int
    member_id: int
    course_id: int
    status: EnrollmentStatus

    class Config:
        orm_mode = True


class EnrollmentCreateSchema(BaseModel):
    member_id: int
    course_id: int
    status: EnrollmentStatus = Field(default=EnrollmentStatus.PENDING)


class EnrollmentUpdateSchema(BaseModel):
    member_id: int
    course_id: int
    status: EnrollmentStatus = Field(None)
