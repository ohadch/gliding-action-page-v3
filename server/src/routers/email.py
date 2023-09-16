from src.app import app
from src.schemas.email import EmailCreateSchema, EmailUpdateSchema, EmailSearchSchema

from src.crud.email import EmailCrud


crud = EmailCrud()

crud.add_crud_routes_to_app(
    app=app,
    tags=["emails"],
    prefix="emails",
    search_schema=EmailSearchSchema,
    create_schema=EmailCreateSchema,
    update_schema=EmailUpdateSchema,
)
