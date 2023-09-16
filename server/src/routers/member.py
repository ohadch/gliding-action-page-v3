from src.app import app
from src.schemas.member import MemberCreateSchema, MemberUpdateSchema, MemberSearchSchema

from src.crud.member import MemberCrud


crud = MemberCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["members"],
    prefix="members",
    search_schema=MemberSearchSchema,
    create_schema=MemberCreateSchema,
    update_schema=MemberUpdateSchema,
)
