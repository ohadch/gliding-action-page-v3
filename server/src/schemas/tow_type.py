from typing import Optional

from pydantic import BaseModel, ConfigDict


class TowTypeSchema(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class TowTypeCreateSchema(BaseModel):
    name: str


class TowTypeUpdateSchema(BaseModel):
    name: Optional[str] = None


class TowTypeSearchSchema(TowTypeUpdateSchema):
    pass
