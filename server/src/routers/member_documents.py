from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.config.dependencies import get_db
from src.models import Member, MemberDocument
from src.schemas.member_document import (
    MemberDocumentSchema,
    MemberDocumentCreateSchema,
    MemberDocumentUpdateSchema,
)

router = APIRouter(
    prefix="/members/{member_id}/documents",
    tags=["members"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=list[MemberDocumentSchema])
async def read_member_documents(member_id: int, db: Session = Depends(get_db)):
    member = db.query(Member).get(member_id)
    return member.documents


@router.get("/{document_id}", response_model=MemberDocumentSchema)
async def read_member_document(
    member_id: int, document_id: int, db: Session = Depends(get_db)
):
    member = db.query(Member).get(member_id)
    return member.documents.get(document_id)


@router.post("/", response_model=MemberDocumentSchema)
async def create_member_document(
    member_id: int,
    member_document_schema: MemberDocumentCreateSchema,
    db: Session = Depends(get_db),
):
    member_document = MemberDocument()
    member_document.member_id = member_id
    for key, value in member_document_schema.__dict__.items():
        setattr(member_document, key, value)
    db.add(member_document)
    db.commit()
    db.refresh(member_document)
    return member_document


@router.put("/{document_id}", response_model=MemberDocumentSchema)
async def update_member_document(
    member_id: int,
    document_id: int,
    member_document_schema: MemberDocumentUpdateSchema,
    db: Session = Depends(get_db),
):
    member = db.query(Member).get(member_id)
    member_document = db.query(MemberDocument).get(document_id)

    for key, value in member_document_schema.__dict__.items():
        setattr(member_document, key, value)

    db.commit()
    db.refresh(member_document)
    return member_document


@router.delete("/{document_id}")
async def delete_member_document(
    member_id: int, document_id: int, db: Session = Depends(get_db)
):
    db.query(MemberDocument).filter(MemberDocument.id == document_id).delete()
    db.commit()
    return {"message": "Member document deleted successfully."}
