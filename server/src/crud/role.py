from uuid import UUID

from ..models import Role
from ..schemas import (
    RoleSchema,
    RoleSearchSchema,
    RoleCreateSchema,
    RoleUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class RoleCrud(
    GenericModelCrud[
        Role,
        UUID,
        RoleSchema,
        RoleSearchSchema,
        RoleCreateSchema,
        RoleUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=Role)
