from uuid import UUID

from ..models import MemberRole
from ..schemas import (
    MemberRoleSchema,
    MemberRoleSearchSchema,
    MemberRoleCreateSchema,
    MemberRoleUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class MemberRoleCrud(
    GenericModelCrud[
        MemberRole,
        UUID,
        MemberRoleSchema,
        MemberRoleSearchSchema,
        MemberRoleCreateSchema,
        MemberRoleUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=MemberRole)
