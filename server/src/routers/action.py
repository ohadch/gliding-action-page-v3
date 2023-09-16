from src.app import app

from src.crud.action import ActionCrud


crud = ActionCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["actions"],
    prefix="actions",
)
