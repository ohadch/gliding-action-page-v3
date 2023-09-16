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
    call_sign: Optional[str] = None
    num_seats: Optional[int] = None
    type: Optional[int] = None


class GliderSearchSchema(GliderUpdateSchema):
    pass
