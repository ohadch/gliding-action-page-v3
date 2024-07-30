from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ActionSchema(BaseModel):
    id: int
    date: datetime
    closed_at: Optional[datetime] = None
    field_responsible_id: Optional[int] = None
    responsible_cfi_id: Optional[int] = None
    data_exported_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ActionCreateSchema(BaseModel):
    date: datetime
    closed_at: Optional[datetime]
    field_responsible_id: Optional[int] = None
    responsible_cfi_id: Optional[int] = None
    data_exported_at: Optional[datetime] = None


class ActionUpdateSchema(BaseModel):
    date: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    field_responsible_id: Optional[int] = None
    responsible_cfi_id: Optional[int] = None
    data_exported_at: Optional[datetime] = None


class ActionSearchSchema(ActionUpdateSchema):
    pass
