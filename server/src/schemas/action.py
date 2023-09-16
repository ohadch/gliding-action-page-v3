from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ActionSchema(BaseModel):
    id: int
    date: datetime
    closed_at: Optional[datetime] = None
    field_responsible_id: Optional[int] = None
    responsible_cfi_id: Optional[int] = None
    instruction_glider_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class ActionCreateSchema(BaseModel):
    date: datetime
    closed_at: Optional[datetime]
    field_responsible_id: Optional[int] = None
    responsible_cfi_id: Optional[int] = None
    instruction_glider_id: Optional[int] = None


class ActionUpdateSchema(BaseModel):
    date: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    field_responsible_id: Optional[int] = None
    responsible_cfi_id: Optional[int] = None
    instruction_glider_id: Optional[int] = None


class ActionSearchSchema(ActionUpdateSchema):
    pass
