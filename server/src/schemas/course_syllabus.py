from pydantic import BaseModel


class InstructionPlanSyllabusSchema(BaseModel):
    id: int
    course_id: int
    syllabus_id: int

    class Config:
        orm_mode = True


class InstructionPlanSyllabusCreateSchema(BaseModel):
    course_id: int
    syllabus_id: int


class InstructionPlanSyllabusUpdateSchema(BaseModel):
    course_id: int
    syllabus_id: int
