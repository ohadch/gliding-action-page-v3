from uuid import UUID

from ..models import Role
from ..schemas.role import RoleCreateSchema, RoleUpdateSchema, RoleSearchSchema
from ..utils.crud import GenericModelCrud


class RoleCrud(
    GenericModelCrud[
        Role,
        UUID,
        RoleSearchSchema,
        RoleCreateSchema,
        RoleUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=Role)
