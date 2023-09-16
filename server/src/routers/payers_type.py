from src.app import app
from src.schemas.payers_type import PayersTypeCreateSchema, PayersTypeUpdateSchema, PayersTypeSearchSchema

from src.crud.payers_type import PayersTypeCrud


crud = PayersTypeCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["payers_types"],
    prefix="payers_types",
    search_schema=PayersTypeSearchSchema,
    create_schema=PayersTypeCreateSchema,
    update_schema=PayersTypeUpdateSchema,
)
