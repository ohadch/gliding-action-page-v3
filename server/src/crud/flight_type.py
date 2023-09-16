from uuid import UUID

from ..models import FlightType
from ..schemas import (
    FlightTypeSchema,
    FlightTypeSearchSchema,
    FlightTypeCreateSchema,
    FlightTypeUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class FlightTypeCrud(
    GenericModelCrud[
        FlightType,
        UUID,
        FlightTypeSchema,
        FlightTypeSearchSchema,
        FlightTypeCreateSchema,
        FlightTypeUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=FlightType)
