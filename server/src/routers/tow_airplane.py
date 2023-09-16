from src.app import app

from src.crud import TowAirplaneCrud


crud = TowAirplaneCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["tow_airplanes"],
    prefix="tow_airplanes",
)
