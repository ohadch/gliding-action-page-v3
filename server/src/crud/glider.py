from uuid import UUID

from ..models import Glider
from ..schemas import (
    GliderSchema,
    GliderSearchSchema,
    GliderCreateSchema,
    GliderUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class GliderCrud(
    GenericModelCrud[
        Glider,
        UUID,
        GliderSchema,
        GliderSearchSchema,
        GliderCreateSchema,
        GliderUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=Glider)
