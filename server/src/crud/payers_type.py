from uuid import UUID

from ..models import PayersType
from ..schemas.payers_type import PayersTypeCreateSchema, PayersTypeUpdateSchema, PayersTypeSearchSchema
from ..utils.crud import GenericModelCrud


class PayersTypeCrud(
    GenericModelCrud[
        PayersType,
        UUID,
        PayersTypeSearchSchema,
        PayersTypeCreateSchema,
        PayersTypeUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=PayersType)
