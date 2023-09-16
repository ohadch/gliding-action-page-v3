from src.app import app
from src.schemas.glider_owner import GliderOwnerCreateSchema, GliderOwnerUpdateSchema, GliderOwnerSearchSchema

from src.crud.glider_owner import GliderOwnerCrud


crud = GliderOwnerCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["glider_owners"],
    prefix="glider_owners",
    search_schema=GliderOwnerSearchSchema,
    create_schema=GliderOwnerCreateSchema,
    update_schema=GliderOwnerUpdateSchema,
)
