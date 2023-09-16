from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.config.dependencies import get_db
from src.models import DocumentType
from src.schemas.document_type import (
    DocumentTypeSchema,
    DocumentTypeUpdateSchema,
    DocumentTypeCreateSchema,
)

router = APIRouter(
    prefix="/document_types",
    tags=["document_types"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=list[DocumentTypeSchema])
async def read_document_types(db: Session = Depends(get_db)):
    return db.query(DocumentType).all()


@router.get("/{document_type_id}", response_model=DocumentTypeSchema)
async def read_document_type(document_type_id: int, db: Session = Depends(get_db)):
    return db.query(DocumentType).get(document_type_id)


@router.post("/", response_model=DocumentTypeSchema)
async def create_document_type(
    document_type_schema: DocumentTypeCreateSchema, db: Session = Depends(get_db)
):
    document_type = DocumentType(**document_type_schema.__dict__)
    db.add(document_type)
    db.commit()
    db.refresh(document_type)
    return document_type


@router.put("/{document_type_id}", response_model=DocumentTypeSchema)
async def update_document_type(
    document_type_id: int,
    document_type_schema: DocumentTypeUpdateSchema,
    db: Session = Depends(get_db),
):
    document_type = db.query(DocumentType).get(document_type_id)
    for key, value in document_type_schema.__dict__.items():
        setattr(document_type, key, value)
    db.commit()
    db.refresh(document_type)
    return document_type


@router.delete("/{document_type_id}")
async def delete_document_type(document_type_id: int, db: Session = Depends(get_db)):
    document_type = db.query(DocumentType).get(document_type_id)
    db.delete(document_type)
    db.commit()
    return {"message": "DocumentType deleted successfully."}
