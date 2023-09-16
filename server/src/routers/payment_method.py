from src.app import app

from src.crud import PaymentMethodCrud


crud = PaymentMethodCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["payment_methods"],
    prefix="payment_methods",
)
