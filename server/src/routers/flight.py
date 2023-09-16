from src.app import app

from src.crud import FlightCrud


crud = FlightCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["flights"],
    prefix="flights",
)
