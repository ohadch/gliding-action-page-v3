from uuid import UUID

from ..models import TowAirplane
from ..schemas import (
    TowAirplaneSchema,
    TowAirplaneSearchSchema,
    TowAirplaneCreateSchema,
    TowAirplaneUpdateSchema,
)
from ..utils.crud import GenericModelCrud


class TowAirplaneCrud(
    GenericModelCrud[
        TowAirplane,
        UUID,
        TowAirplaneSchema,
        TowAirplaneSearchSchema,
        TowAirplaneCreateSchema,
        TowAirplaneUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=TowAirplane)
