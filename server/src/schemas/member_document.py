import datetime

from pydantic import BaseModel, Field

from src.models.member_document import MemberDocumentStatus


class MemberDocumentSchema(BaseModel):
    id: int
    member_id: int
    type_id: int
    status: MemberDocumentStatus
    expiration_at: datetime.datetime

    class Config:
        orm_mode = True


class MemberDocumentCreateSchema(BaseModel):
    type_id: int
    status: MemberDocumentStatus = Field(default=MemberDocumentStatus.PENDING)
    expiration_at: str


class MemberDocumentUpdateSchema(BaseModel):
    type_id: int
    status: MemberDocumentStatus = Field(None)
    expiration_at: str = Field(None)
