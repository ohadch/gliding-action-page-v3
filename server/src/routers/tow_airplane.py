from src.app import app
from src.schemas.tow_airplane import TowAirplaneCreateSchema, TowAirplaneUpdateSchema, TowAirplaneSearchSchema

from src.crud.tow_airplane import TowAirplaneCrud


crud = TowAirplaneCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["tow_airplanes"],
    prefix="tow_airplanes",
    search_schema=TowAirplaneSearchSchema,
    create_schema=TowAirplaneCreateSchema,
    update_schema=TowAirplaneUpdateSchema,
)
