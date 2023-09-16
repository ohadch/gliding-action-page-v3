from uuid import UUID

from ..models import PaymentMethod
from ..schemas.payment_method import PaymentMethodCreateSchema, PaymentMethodUpdateSchema, PaymentMethodSearchSchema
from ..utils.crud import GenericModelCrud


class PaymentMethodCrud(
    GenericModelCrud[
        PaymentMethod,
        UUID,
        PaymentMethodSearchSchema,
        PaymentMethodCreateSchema,
        PaymentMethodUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=PaymentMethod)
