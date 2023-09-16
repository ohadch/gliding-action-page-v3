from uuid import UUID

from ..models import TowType
from ..schemas.tow_type import TowTypeCreateSchema, TowTypeUpdateSchema, TowTypeSearchSchema
from ..utils.crud import GenericModelCrud


class TowTypeCrud(
    GenericModelCrud[
        TowType,
        UUID,
        TowTypeSearchSchema,
        TowTypeCreateSchema,
        TowTypeUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=TowType)
