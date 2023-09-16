from typing import Optional

from pydantic import BaseModel, ConfigDict


class MemberRoleSchema(BaseModel):
    id: int
    member_id: int
    role_id: int

    model_config = ConfigDict(from_attributes=True)


class MemberRoleCreateSchema(BaseModel):
    member_id: int
    role_id: int


class MemberRoleUpdateSchema(BaseModel):
    member_id: Optional[int] = None
    role_id: Optional[int] = None


class MemberRoleSearchSchema(MemberRoleUpdateSchema):
    pass
