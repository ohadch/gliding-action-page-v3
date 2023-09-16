from src.app import app
from src.schemas.tow_type import TowTypeCreateSchema, TowTypeUpdateSchema, TowTypeSearchSchema

from src.crud.tow_type import TowTypeCrud


crud = TowTypeCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["tow_types"],
    prefix="tow_types",
    search_schema=TowTypeSearchSchema,
    create_schema=TowTypeCreateSchema,
    update_schema=TowTypeUpdateSchema,
)
