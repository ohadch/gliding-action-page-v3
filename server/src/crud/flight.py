from uuid import UUID

from ..models import Flight
from ..schemas import (
    FlightSchema,
    FlightSearchSchema,
    FlightCreateSchema,
    FlightUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class FlightCrud(
    GenericModelCrud[
        Flight,
        UUID,
        FlightSchema,
        FlightSearchSchema,
        FlightCreateSchema,
        FlightUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=Flight)
