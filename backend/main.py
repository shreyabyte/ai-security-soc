from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI SOC Backend")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/logs", response_model=schemas.LogOut)
def create_log(log: schemas.LogCreate, db: Session = Depends(get_db)):
    db_log = models.Log(**log.dict())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@app.get("/logs", response_model=List[schemas.LogOut])
def get_logs(db: Session = Depends(get_db)):
    return db.query(models.Log).order_by(models.Log.timestamp.desc()).all()