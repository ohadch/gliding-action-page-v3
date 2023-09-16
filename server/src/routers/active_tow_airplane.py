from src.app import app
from src.schemas.active_tow_airplane import ActiveTowAirplaneCreateSchema, ActiveTowAirplaneUpdateSchema, ActiveTowAirplaneSearchSchema

from src.crud.active_tow_airplane import ActiveTowAirplaneCrud


crud = ActiveTowAirplaneCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["active_tow_airplanes"],
    prefix="active_tow_airplanes",
    search_schema=ActiveTowAirplaneSearchSchema,
    create_schema=ActiveTowAirplaneCreateSchema,
    update_schema=ActiveTowAirplaneUpdateSchema,
)
