from typing import Optional, Any, Type, Dict, Union, TypeVar, Generic, List
from uuid import UUID

from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session, Query
from sqlalchemy_pagination import paginate

from src.database import Base, get_db
from src.settings import get_settings, Settings

TModel = TypeVar("TModel", bound=Base)
TModelIDType = TypeVar("TModelIDType", int, str, UUID)
TModelSearchSchema = TypeVar("TModelSearchSchema", bound=BaseModel)
TModelCreateSchema = TypeVar("TModelCreateSchema", bound=BaseModel)
TModelUpdateSchema = TypeVar("TModelUpdateSchema", bound=BaseModel)


class GenericModelCrud(
    Generic[
        TModel, TModelIDType, TModelSearchSchema, TModelCreateSchema, TModelUpdateSchema
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

    def add_crud_routes_to_app(
        self,
        app: FastAPI,
        tags: List[str],
        prefix: str,
        search_schema: Type[TModelSearchSchema],
        create_schema: Type[TModelCreateSchema],
        update_schema: Type[TModelUpdateSchema],
    ):
        """
        Generate CRUD router.
        :param app: FastAPI app
        :param tags: Tags
        :param prefix: Prefix
        :param search_schema: Search schema
        :param create_schema: Create schema
        :param update_schema: Update schema
        """
        @app.post(
            f"/{prefix}/search",
            tags=tags,
            response_model=List[self.model],
            summary=f"Search {prefix}",
        )
        async def search(
            page: int = 1,
            page_size: Optional[int] = None,
            filters: Optional[search_schema] = None,
            db: Session = Depends(get_db),
            settings: Settings = Depends(get_settings),
        ):
            """
            Search items
            :param page: Page number
            :param page_size: Page size
            :param filters: Filters
            :param db: Database session
            :param settings: Settings
            :return: List of items
            """
            return await self.search(
                db=db,
                filters=filters,
                page=page,
                page_size=page_size or settings.default_page_size,
            )

        @app.post(
            f"/{prefix}",
            tags=tags,
            response_model=self.model,
            summary=f"Create {prefix}",
        )
        async def create(
            data: create_schema, db: Session = Depends(get_db)
        ):
            """
            Create item
            :param data: Data
            :param db: Database session
            """
            return await self.create(
                db=db,
                data=data,
            )

        @app.get(
            f"/{prefix}/{{id_}}",
            tags=tags,
            response_model=self.model,
            summary=f"Get {prefix} by ID",
        )
        async def get_by_id(id_: UUID, db: Session = Depends(get_db)):
            """
            Read item by ID
            :param id_: Item ID
            :param db: Database session
            :return: Item
            """
            item = await self.get_by_id(db=db, id_=id_)
            if not item:
                raise HTTPException(status_code=404, detail=f"{prefix.title()} not found")
            return item

        @app.put(
            f"/{prefix}/{{id_}}",
            tags=tags,
            response_model=self.model,
            summary=f"Update {prefix}",
        )
        async def update(
            id_: UUID,
            data: update_schema,
            db: Session = Depends(get_db),
        ):
            """
            Update item
            :param id_: Item ID
            :param data: Data to update
            :param db: Database session
            :return: Updated item
            """
            return self.update(
                db=db,
                id_=id_,
                data=data,
            )

        @app.delete(
            f"/{prefix}/{{id_}}",
            tags=tags,
            summary=f"Delete {prefix}",
        )
        async def delete(id_: UUID, db: Session = Depends(get_db)):
            """
            Delete item
            :param id_: Item ID
            :param db: Database session
            """
            self.delete(db=db, id_=id_)

        return app
