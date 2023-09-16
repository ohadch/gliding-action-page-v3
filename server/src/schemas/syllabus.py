from pydantic import BaseModel


class SyllabusSchema(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class SyllabusCreateSchema(BaseModel):
    name: str


class SyllabusUpdateSchema(BaseModel):
    name: str
