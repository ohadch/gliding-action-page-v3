from src.app import app

from src.crud import MemberRoleCrud


crud = MemberRoleCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["member_roles"],
    prefix="member_roles",
)
