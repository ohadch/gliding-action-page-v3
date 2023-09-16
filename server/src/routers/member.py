from src.app import app

from src.crud import MemberCrud


crud = MemberCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["members"],
    prefix="members",
)
