from src.app import app
from src.schemas.glider import GliderTypeCreateSchema, GliderTypeUpdateSchema, GliderTypeSearchSchema

from src.crud.glider import GliderTypeCrud


crud = GliderTypeCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["gliders"],
    prefix="gliders",
    search_schema=GliderTypeSearchSchema,
    create_schema=GliderTypeCreateSchema,
    update_schema=GliderTypeUpdateSchema,
)
