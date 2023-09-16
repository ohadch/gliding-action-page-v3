from uuid import UUID

from ..models import ActiveTowAirplane
from ..schemas import (
    ActiveTowAirplaneSchema,
    ActiveTowAirplaneSearchSchema,
    ActiveTowAirplaneCreateSchema,
    ActiveTowAirplaneUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class ActiveTowAirplaneCrud(
    GenericModelCrud[
        ActiveTowAirplane,
        UUID,
        ActiveTowAirplaneSchema,
        ActiveTowAirplaneSearchSchema,
        ActiveTowAirplaneCreateSchema,
        ActiveTowAirplaneUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=ActiveTowAirplane)
