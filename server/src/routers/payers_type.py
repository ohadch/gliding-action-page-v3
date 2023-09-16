from src.app import app

from src.crud import PayersTypeCrud


crud = PayersTypeCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["payers_types"],
    prefix="payers_types",
)
