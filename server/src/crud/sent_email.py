from uuid import UUID

from ..models import SentEmail
from ..schemas.sent_email import SentEmailCreateSchema, SentEmailUpdateSchema, SentEmailSearchSchema
from ..utils.crud import GenericModelCrud


class SentEmailCrud(
    GenericModelCrud[
        SentEmail,
        UUID,
        SentEmailSearchSchema,
        SentEmailCreateSchema,
        SentEmailUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=SentEmail)
