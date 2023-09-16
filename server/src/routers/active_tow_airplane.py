from src.app import app

from src.crud import ActiveTowAirplaneCrud


crud = ActiveTowAirplaneCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["active_tow_airplanes"],
    prefix="active_tow_airplanes",
)
