from typing import Optional

from pydantic import BaseModel, ConfigDict


class GliderOwnerSchema(BaseModel):
    id: int
    glider_id: int
    member_id: int

    model_config = ConfigDict(from_attributes=True)


class GliderOwnerCreateSchema(BaseModel):
    glider_id: int
    member_id: int


class GliderOwnerUpdateSchema(BaseModel):
    glider_id: Optional[int]
    member_id: Optional[int]


class GliderOwnerSearchSchema(GliderOwnerUpdateSchema):
    pass
