from typing import Optional

from pydantic import BaseModel


class MemberSchema(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone_number: Optional[str]

    class Config:
        orm_mode = True


class MemberCreateSchema(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone_number: Optional[str]


class MemberUpdateSchema(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    phone_number: Optional[str]


class MemberSearchSchema(MemberUpdateSchema):
    pass
