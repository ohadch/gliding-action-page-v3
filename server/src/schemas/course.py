from pydantic import BaseModel


class CourseSchema(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class CourseCreateSchema(BaseModel):
    name: str


class CourseUpdateSchema(BaseModel):
    name: str
