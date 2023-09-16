from uuid import UUID

from ..models import PaymentMethod
from ..schemas import (
    PaymentMethodSchema,
    PaymentMethodSearchSchema,
    PaymentMethodCreateSchema,
    PaymentMethodUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class PaymentMethodCrud(
    GenericModelCrud[
        PaymentMethod,
        UUID,
        PaymentMethodSchema,
        PaymentMethodSearchSchema,
        PaymentMethodCreateSchema,
        PaymentMethodUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=PaymentMethod)
