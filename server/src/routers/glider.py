from src.app import app

from src.crud import GliderCrud


crud = GliderCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["gliders"],
    prefix="gliders",
)
