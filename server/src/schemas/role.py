from typing import Optional

from pydantic import BaseModel, ConfigDict


class RoleSchema(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class RoleCreateSchema(BaseModel):
    name: str


class RoleUpdateSchema(BaseModel):
    name: Optional[str] = None


class RoleSearchSchema(RoleUpdateSchema):
    pass
