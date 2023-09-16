from uuid import UUID

from ..models import Action
from ..schemas import (
    ActionSchema,
    ActionSearchSchema,
    ActionCreateSchema,
    ActionUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class ActionCrud(
    GenericModelCrud[
        Action,
        UUID,
        ActionSchema,
        ActionSearchSchema,
        ActionCreateSchema,
        ActionUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=Action)
