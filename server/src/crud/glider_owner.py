from uuid import UUID

from ..models import GliderOwner
from ..schemas import (
    GliderOwnerSchema,
    GliderOwnerSearchSchema,
    GliderOwnerCreateSchema,
    GliderOwnerUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class GliderOwnerCrud(
    GenericModelCrud[
        GliderOwner,
        UUID,
        GliderOwnerSchema,
        GliderOwnerSearchSchema,
        GliderOwnerCreateSchema,
        GliderOwnerUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=GliderOwner)
