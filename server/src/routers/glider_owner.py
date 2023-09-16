from src.app import app

from src.crud import GliderOwnerCrud


crud = GliderOwnerCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["glider_owners"],
    prefix="glider_owners",
)
