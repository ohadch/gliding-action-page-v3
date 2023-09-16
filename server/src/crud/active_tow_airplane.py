from uuid import UUID

from ..models import ActiveTowAirplane
from ..schemas.active_tow_airplane import ActiveTowAirplaneCreateSchema, ActiveTowAirplaneUpdateSchema, ActiveTowAirplaneSearchSchema
from ..utils.crud import GenericModelCrud


class ActiveTowAirplaneCrud(
    GenericModelCrud[
        ActiveTowAirplane,
        UUID,
        ActiveTowAirplaneSearchSchema,
        ActiveTowAirplaneCreateSchema,
        ActiveTowAirplaneUpdateSchema,
    ]
):
    def __init__(self):
        super().__init__(model=ActiveTowAirplane)
