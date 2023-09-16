from uuid import UUID

from ..models import PayersType
from ..schemas import (
    PayersTypeSchema,
    PayersTypeSearchSchema,
    PayersTypeCreateSchema,
    PayersTypeUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class PayersTypeCrud(
    GenericModelCrud[
        PayersType,
        UUID,
        PayersTypeSchema,
        PayersTypeSearchSchema,
        PayersTypeCreateSchema,
        PayersTypeUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=PayersType)
