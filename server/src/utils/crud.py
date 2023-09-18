from typing import Optional, Any, Type, Dict, Union, TypeVar, Generic, List
from uuid import UUID

from pydantic import BaseModel
from sqlalchemy.orm import Session, Query
from sqlalchemy_pagination import paginate

from src.database import Base
from src.settings import get_settings

TModel = TypeVar("TModel", bound=Base)
TModelIDType = TypeVar("TModelIDType", int, str, UUID)
TModelSchema = TypeVar("TModelSchema", bound=BaseModel)
TModelSearchSchema = TypeVar("TModelSearchSchema", bound=BaseModel)
TModelCreateSchema = TypeVar("TModelCreateSchema", bound=BaseModel)
TModelUpdateSchema = TypeVar("TModelUpdateSchema", bound=BaseModel)


class GenericModelCrud(
    Generic[
        TModel,
        TModelIDType,
        TModelSchema,
        TModelSearchSchema,
        TModelCreateSchema,
        TModelUpdateSchema,
    ]
):
    def __init__(
        self,
        model: Type[TModel],
    ):
        self.model = model

    async def search(
        self,
        db: Session,
        filters: Optional[TModelSearchSchema] = None,
        page: int = 1,
        page_size: Optional[int] = None,
    ) -> List[TModel]:
        """
        Return a list of items.
        :param db: Database session
        :param filters: Filters to apply
        :param page: Page number
        :param page_size: Page size
        :return: List of items
        """
        settings = get_settings()
        filters_dict = filters.dict(exclude_none=True) if filters else {}
        query = self.build_sqlalchemy_query_by_dict_filters(db=db, filters=filters_dict)
        response = paginate(
            query=query, page=page, page_size=page_size or settings.default_page_size
        )
        return response.items

    async def create(self, db: Session, data: TModelCreateSchema) -> TModel:
        """
        Create a new item.
        :param db: Database session
        :param data: Data to create
        :return: Created item
        """
        db_item = self.model(**data.dict())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item

    def get_by_id(self, db: Session, id_: Union[int, str, UUID]):
        """
        Get an item by ID.
        :param db: Database session
        :param id_: Item ID
        :return: Item
        """
        return db.query(self.model).get(id_)

    def update(self, db: Session, id_: Union[int, str, UUID], data: BaseModel):
        """
        Update an item.
        :param db: Database session
        :param id_: Item ID
        :param data: Data to update
        :return: Updated item
        """
        db_item = db.query(self.model).filter_by(id=id_)
        db_item.update(data.dict(exclude_unset=True))
        db.commit()

    def delete(self, db: Session, id_: Union[int, str, UUID]):
        """
        Delete an item.
        :param db: Database session
        :param id_: Item ID
        :return: Deleted item
        """
        item = db.query(self.model).get(id_)
        db.delete(item)
        db.commit()

    def build_sqlalchemy_query_by_dict_filters(
        self, db: Session, filters: Dict[str, Any]
    ) -> Query:
        """
        Build a SQLAlchemy query by a dict of filters.
        :param db: Database session
        :param filters: Filters to apply
        :return: SQLAlchemy query
        """
        query = db.query(self.model)

        for key, value in filters.items():
            if not value:
                continue
            if not hasattr(self.model, key):
                continue
            elif isinstance(value, list):
                query = query.filter(getattr(self.model, key).in_(value))
            else:
                query = query.filter(getattr(self.model, key) == value)

        return query
