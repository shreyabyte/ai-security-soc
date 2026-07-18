from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import detection
from database import engine, SessionLocal

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(title="AI SOC Backend")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Later to be replaced "*" with Vercel frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create a new log
@app.post("/logs", response_model=schemas.LogOut)
def create_log(log: schemas.LogCreate, db: Session = Depends(get_db)):
    db_log = models.Log(**log.dict())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    detection.run_detection(db, db_log)

    return db_log

# Get all logs
@app.get("/logs", response_model=List[schemas.LogOut])
def get_logs(db: Session = Depends(get_db)):
    return db.query(models.Log).order_by(models.Log.timestamp.desc()).all()

@app.get("/alerts", response_model=List[schemas.AlertOut])
def get_alerts(db: Session = Depends(get_db)):
    return db.query(models.Alert).order_by(models.Alert.timestamp.desc()).all()

@app.get("/servers")
def get_servers(db: Session = Depends(get_db)):
    server_ids = db.query(models.Log.server_id).distinct().all()
    server_ids = [s[0] for s in server_ids]

    result = []
    for server_id in server_ids:
        latest_log = (
            db.query(models.Log)
            .filter(models.Log.server_id == server_id)
            .order_by(models.Log.timestamp.desc())
            .first()
        )

        latest_cpu_log = (
            db.query(models.Log)
            .filter(models.Log.server_id == server_id, models.Log.event_type == "cpu_usage")
            .order_by(models.Log.timestamp.desc())
            .first()
        )

        cpu = 0
        if latest_cpu_log:
            try:
                cpu = int(latest_cpu_log.details.split("=")[1].replace("%", ""))
            except (IndexError, ValueError):
                cpu = 0

        if cpu > 85:
            status = "warning"
        else:
            status = "online"

        result.append({
            "server_id": server_id,
            "status": status,
            "cpu": cpu,
            "last_seen": latest_log.timestamp if latest_log else None,
        })

    return result