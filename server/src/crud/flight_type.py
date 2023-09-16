from uuid import UUID

from ..models import FlightType
from ..schemas.flight_type import FlightTypeCreateSchema, FlightTypeUpdateSchema, FlightTypeSearchSchema
from ..utils.crud import GenericModelCrud


class FlightTypeCrud(
    GenericModelCrud[
        FlightType,
        UUID,
        FlightTypeSearchSchema,
        FlightTypeCreateSchema,
        FlightTypeUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=FlightType)
