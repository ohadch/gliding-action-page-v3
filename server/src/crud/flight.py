from uuid import UUID

from ..models import Flight
from ..schemas.flight import FlightCreateSchema, FlightUpdateSchema, FlightSearchSchema
from ..utils.crud import GenericModelCrud


class FlightCrud(
    GenericModelCrud[
        Flight,
        UUID,
        FlightSearchSchema,
        FlightCreateSchema,
        FlightUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=Flight)
