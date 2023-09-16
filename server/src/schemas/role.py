import datetime
from typing import Optional

from pydantic import BaseModel


class RoleSchema(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class RoleCreateSchema(BaseModel):
    name: str


class RoleUpdateSchema(BaseModel):
    name: Optional[str]
