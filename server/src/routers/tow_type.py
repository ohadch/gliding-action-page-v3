from src.app import app

from src.crud import TowTypeCrud


crud = TowTypeCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["tow_types"],
    prefix="tow_types",
)
