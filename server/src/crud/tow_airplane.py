from uuid import UUID

from ..models import TowAirplane
from ..schemas.tow_airplane import TowAirplaneCreateSchema, TowAirplaneUpdateSchema, TowAirplaneSearchSchema
from ..utils.crud import GenericModelCrud


class TowAirplaneCrud(
    GenericModelCrud[
        TowAirplane,
        UUID,
        TowAirplaneSearchSchema,
        TowAirplaneCreateSchema,
        TowAirplaneUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=TowAirplane)
