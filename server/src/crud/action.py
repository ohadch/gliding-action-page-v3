from uuid import UUID

from .. import Action
from ..schemas.action import ActionCreateSchema, ActionUpdateSchema
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
        super().__init__(model=model.Action)
