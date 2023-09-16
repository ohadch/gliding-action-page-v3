from uuid import UUID

from ..models import Member
from ..schemas import (
    MemberSchema,
    MemberSearchSchema,
    MemberCreateSchema,
    MemberUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class MemberCrud(
    GenericModelCrud[
        Member,
        UUID,
        MemberSchema,
        MemberSearchSchema,
        MemberCreateSchema,
        MemberUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=Member)
