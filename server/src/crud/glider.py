from uuid import UUID

from ..models import Glider
from ..schemas.glider import GliderCreateSchema, GliderUpdateSchema, GliderSearchSchema
from ..utils.crud import GenericModelCrud


class GliderCrud(
    GenericModelCrud[
        Glider,
        UUID,
        GliderSearchSchema,
        GliderCreateSchema,
        GliderUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=Glider)
