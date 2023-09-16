from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ActionSchema(BaseModel):
    id: int
    date: datetime
    closed_at: datetime
    field_responsible_id: int
    responsible_cfi_id: int
    instruction_glider_id: int

    class Config:
        orm_mode = True


class ActionCreateSchema(BaseModel):
    date: datetime
    closed_at: Optional[datetime]
    field_responsible_id: Optional[int]
    responsible_cfi_id: Optional[int]
    instruction_glider_id: Optional[int]


class ActionUpdateSchema(BaseModel):
    date: Optional[datetime]
    closed_at: Optional[datetime]
    field_responsible_id: Optional[int]
    responsible_cfi_id: Optional[int]
    instruction_glider_id: Optional[int]


class ActionSearchSchema(ActionUpdateSchema):
    pass
