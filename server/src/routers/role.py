from src.app import app
from src.schemas.role import RoleCreateSchema, RoleUpdateSchema, RoleSearchSchema

from src.crud.role import RoleCrud


crud = RoleCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["roles"],
    prefix="roles",
    search_schema=RoleSearchSchema,
    create_schema=RoleCreateSchema,
    update_schema=RoleUpdateSchema,
)
