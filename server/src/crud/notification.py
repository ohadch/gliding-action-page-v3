from uuid import UUID

from ..models import Notification
from ..schemas import (
    NotificationSchema,
    NotificationSearchSchema,
    NotificationCreateSchema,
    NotificationUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class NotificationCrud(
    GenericModelCrud[
        Notification,
        UUID,
        NotificationSchema,
        NotificationSearchSchema,
        NotificationCreateSchema,
        NotificationUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=Notification)
