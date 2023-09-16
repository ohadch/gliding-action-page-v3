from src.app import app
from src.schemas.member_role import MemberRoleCreateSchema, MemberRoleUpdateSchema, MemberRoleSearchSchema

from src.crud.member_role import MemberRoleCrud


crud = MemberRoleCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["member_roles"],
    prefix="member_roles",
    search_schema=MemberRoleSearchSchema,
    create_schema=MemberRoleCreateSchema,
    update_schema=MemberRoleUpdateSchema,
)
