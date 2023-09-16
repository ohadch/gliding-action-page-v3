from src.app import app
from src.schemas.flight_type import FlightTypeCreateSchema, FlightTypeUpdateSchema, FlightTypeSearchSchema

from src.crud.flight_type import FlightTypeCrud


crud = FlightTypeCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["flight_types"],
    prefix="flight_types",
    search_schema=FlightTypeSearchSchema,
    create_schema=FlightTypeCreateSchema,
    update_schema=FlightTypeUpdateSchema,
)
