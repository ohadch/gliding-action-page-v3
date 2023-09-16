from typing import Optional

from pydantic import BaseModel, ConfigDict


class MemberSchema(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone_number: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class MemberCreateSchema(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone_number: Optional[str] = None


class MemberUpdateSchema(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None


class MemberSearchSchema(MemberUpdateSchema):
    pass
