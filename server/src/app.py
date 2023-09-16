import os

import dotenv
from starlette.middleware.cors import CORSMiddleware

dotenv.load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))
from fastapi import FastAPI

from src.routers import (
    members,
    member_documents,
    courses,
    syllabuses,
    document_types,
    enrollments,
    syllabus_items,
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to Ohad's gliding course management system"}


@app.get("/health")
async def health():
    return {"message": "OK"}


app.include_router(members.router)
app.include_router(member_documents.router)
app.include_router(courses.router)
app.include_router(syllabuses.router)
app.include_router(document_types.router)
app.include_router(enrollments.router)
app.include_router(syllabus_items.router)
