from src.app import app
from src.schemas.payment_method import PaymentMethodCreateSchema, PaymentMethodUpdateSchema, PaymentMethodSearchSchema

from src.crud.payment_method import PaymentMethodCrud


crud = PaymentMethodCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["payment_methods"],
    prefix="payment_methods",
    search_schema=PaymentMethodSearchSchema,
    create_schema=PaymentMethodCreateSchema,
    update_schema=PaymentMethodUpdateSchema,
)
