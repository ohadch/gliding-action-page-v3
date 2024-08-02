from uuid import UUID

from ..models import Comment
from ..schemas import (
    CommentSchema,
    CommentSearchSchema,
    CommentCreateSchema,
    CommentUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class CommentCrud(
    GenericModelCrud[
        Comment,
        UUID,
        CommentSchema,
        CommentSearchSchema,
        CommentCreateSchema,
        CommentUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=Comment)
