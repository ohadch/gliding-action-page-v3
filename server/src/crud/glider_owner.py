from uuid import UUID

from ..models import GliderOwner
from ..schemas.glider_owner import GliderOwnerCreateSchema, GliderOwnerUpdateSchema, GliderOwnerSearchSchema
from ..utils.crud import GenericModelCrud


class GliderOwnerCrud(
    GenericModelCrud[
        GliderOwner,
        UUID,
        GliderOwnerSearchSchema,
        GliderOwnerCreateSchema,
        GliderOwnerUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=GliderOwner)
