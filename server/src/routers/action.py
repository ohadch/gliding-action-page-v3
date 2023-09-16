from src.app import app
from src.schemas.action import ActionCreateSchema, ActionUpdateSchema, ActionSearchSchema

from src.crud.action import ActionCrud


crud = ActionCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["actions"],
    prefix="actions",
    search_schema=ActionSearchSchema,
    create_schema=ActionCreateSchema,
    update_schema=ActionUpdateSchema,
)
