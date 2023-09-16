from uuid import UUID

from ..models import MemberRole
from ..schemas.member_role import MemberRoleCreateSchema, MemberRoleUpdateSchema, MemberRoleSearchSchema
from ..utils.crud import GenericModelCrud


class MemberRoleCrud(
    GenericModelCrud[
        MemberRole,
        UUID,
        MemberRoleSearchSchema,
        MemberRoleCreateSchema,
        MemberRoleUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=MemberRole)
