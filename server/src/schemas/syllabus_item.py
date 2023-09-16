from pydantic import BaseModel


class SyllabusItemSchema(BaseModel):
    id: int
    name: str
    syllabus_id: int

    class Config:
        orm_mode = True


class SyllabusItemCreateSchema(BaseModel):
    name: str
    syllabus_id: int


class SyllabusItemUpdateSchema(BaseModel):
    name: str
    syllabus_id: int
