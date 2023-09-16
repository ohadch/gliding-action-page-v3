from uuid import UUID

from ..models import Member
from ..schemas.member import MemberCreateSchema, MemberUpdateSchema, MemberSearchSchema
from ..utils.crud import GenericModelCrud


class MemberCrud(
    GenericModelCrud[
        Member,
        UUID,
        MemberSearchSchema,
        MemberCreateSchema,
        MemberUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=Member)
