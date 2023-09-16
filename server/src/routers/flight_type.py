from src.app import app

from src.crud import FlightTypeCrud


crud = FlightTypeCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["flight_types"],
    prefix="flight_types",
)
