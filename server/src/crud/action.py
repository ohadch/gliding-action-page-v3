from uuid import UUID

from ..models import Action
from ..schemas.action import ActionCreateSchema, ActionUpdateSchema, ActionSearchSchema
from ..utils.crud import GenericModelCrud


class ActionCrud(
    GenericModelCrud[
        Action,
        UUID,
        ActionSearchSchema,
        ActionCreateSchema,
        ActionUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=Action)
