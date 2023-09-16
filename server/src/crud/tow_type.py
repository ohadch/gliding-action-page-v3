from uuid import UUID

from ..models import TowType
from ..schemas import (
    TowTypeSchema,
    TowTypeSearchSchema,
    TowTypeCreateSchema,
    TowTypeUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class TowTypeCrud(
    GenericModelCrud[
        TowType,
        UUID,
        TowTypeSchema,
        TowTypeSearchSchema,
        TowTypeCreateSchema,
        TowTypeUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=TowType)
