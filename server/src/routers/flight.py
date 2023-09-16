from src.app import app
from src.schemas.flight import FlightCreateSchema, FlightUpdateSchema, FlightSearchSchema

from src.crud.flight import FlightCrud


crud = FlightCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["flights"],
    prefix="flights",
    search_schema=FlightSearchSchema,
    create_schema=FlightCreateSchema,
    update_schema=FlightUpdateSchema,
)
