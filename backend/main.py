import os
from fastapi import FastAPI, Depends, BackgroundTasks, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import SessionLocal, init_db
from . import models

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

init_db() # Create tables on startup

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

# Helper to save violations from the engine thread
def save_to_db(data):
    db = SessionLocal()
    new_v = models.Violation(**data)
    db.add(new_v)
    db.commit()
    db.close()

@app.get("/api/violations")
def get_violations(db: Session = Depends(get_db)):
    return {"violations": db.query(models.Violation).all()}

@app.patch("/api/violations/{case_id}/status")
def update_status(case_id: str, status: str, db: Session = Depends(get_db)):
    v = db.query(models.Violation).filter(models.Violation.case_id == case_id).first()
    if v:
        v.status = status
        db.commit()
    return {"message": "Success"}

@app.post("/api/upload")
async def upload(file: UploadFile = File(...), bg: BackgroundTasks = None):
    # Process your video logic here, then call save_to_db()
    # for each violation found in your pipeline
    return {"status": "processing"}
