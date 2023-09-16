from src.app import app

from src.crud import EmailCrud


crud = EmailCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["emails"],
    prefix="emails",
)
