from src.app import app

from src.crud import RoleCrud


crud = RoleCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["roles"],
    prefix="roles",
)
