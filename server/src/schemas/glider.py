from typing import Optional

from pydantic import BaseModel, ConfigDict

from src.utils.enums import GliderType


class GliderSchema(BaseModel):
    id: int
    call_sign: str
    num_seats: int
    type: GliderType

    model_config = ConfigDict(from_attributes=True)


class GliderCreateSchema(BaseModel):
    call_sign: str
    num_seats: int
    type: GliderType


class GliderUpdateSchema(BaseModel):
    call_sign: Optional[str] = None
    num_seats: Optional[int] = None
    type: Optional[GliderType] = None


class GliderSearchSchema(GliderUpdateSchema):
    pass
