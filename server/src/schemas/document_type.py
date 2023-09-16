from pydantic import BaseModel


class DocumentTypeSchema(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class DocumentTypeCreateSchema(BaseModel):
    name: str


class DocumentTypeUpdateSchema(BaseModel):
    name: str
