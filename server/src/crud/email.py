from uuid import UUID

from ..models import Email
from ..schemas import (
    EmailSchema,
    EmailSearchSchema,
    EmailCreateSchema,
    EmailUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class EmailCrud(
    GenericModelCrud[
        Email,
        UUID,
        EmailSchema,
        EmailSearchSchema,
        EmailCreateSchema,
        EmailUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=Email)
