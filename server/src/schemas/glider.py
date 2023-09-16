from typing import Optional

from pydantic import BaseModel, ConfigDict


class GliderSchema(BaseModel):
    id: int
    call_sign: str
    num_seats: int
    type: int

    model_config = ConfigDict(from_attributes=True)


class GliderCreateSchema(BaseModel):
    call_sign: str
    num_seats: int
    type: int


class GliderUpdateSchema(BaseModel):
    call_sign: Optional[str]
    num_seats: Optional[int]
    type: Optional[int]


class GliderSearchSchema(GliderUpdateSchema):
    pass
