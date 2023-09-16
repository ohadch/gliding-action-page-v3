from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database import get_db
from src.models import Member
from src.schemas.member import MemberSchema, MemberCreateSchema, MemberUpdateSchema

router = APIRouter(
    prefix="/members",
    tags=["members"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=list[MemberSchema])
async def read_members(db: Session = Depends(get_db)):
    return db.query(Member).all()


@router.get("/{member_id}", response_model=MemberSchema)
async def read_member(member_id: int, db: Session = Depends(get_db)):
    return db.query(Member).get(member_id)


@router.post("/", response_model=MemberSchema)
async def create_member(
    member_schema: MemberCreateSchema, db: Session = Depends(get_db)
):
    member = Member(**member_schema.__dict__)
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.put("/{member_id}", response_model=MemberSchema)
async def update_member(
    member_id: int, member_schema: MemberUpdateSchema, db: Session = Depends(get_db)
):
    member = db.query(Member).get(member_id)
    for key, value in member_schema.__dict__.items():
        setattr(member, key, value)
    db.commit()
    db.refresh(member)
    return member


@router.delete("/{member_id}")
async def delete_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(Member).get(member_id)
    db.delete(member)
    db.commit()
    return {"message": "Member deleted successfully."}
