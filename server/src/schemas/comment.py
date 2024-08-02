from typing import Optional

from pydantic import BaseModel, ConfigDict


class CommentSchema(BaseModel):
    id: int
    author_id: int
    action_id: int
    flight_id: Optional[int] = None
    text: str

    model_config = ConfigDict(from_attributes=True)


class CommentCreateSchema(BaseModel):
    author_id: int
    action_id: int
    flight_id: Optional[int] = None
    text: str


class CommentUpdateSchema(BaseModel):
    text: Optional[str]


class CommentSearchSchema(BaseModel):
    action_id: Optional[int] = None
