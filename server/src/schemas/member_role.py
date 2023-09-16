from typing import Optional

from pydantic import BaseModel


class MemberRoleSchema(BaseModel):
    id: int
    member_id: int
    role_id: int

    class Config:
        orm_mode = True


class MemberRoleCreateSchema(BaseModel):
    member_id: int
    role_id: int


class MemberRoleUpdateSchema(BaseModel):
    member_id: Optional[int]
    role_id: Optional[int]
