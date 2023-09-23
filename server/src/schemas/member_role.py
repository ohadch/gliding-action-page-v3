from typing import Optional

from pydantic import BaseModel, ConfigDict

from src.utils.enums import Role


class MemberRoleSchema(BaseModel):
    id: int
    member_id: int
    role: Role

    model_config = ConfigDict(from_attributes=True)


class MemberRoleCreateSchema(BaseModel):
    member_id: int
    role: Role


class MemberRoleUpdateSchema(BaseModel):
    member_id: Optional[int] = None
    role: Optional[Role] = None


class MemberRoleSearchSchema(MemberRoleUpdateSchema):
    pass
