from pydantic import BaseModel
from datetime import datetime

class LogCreate(BaseModel):
    server_id: str
    event_type: str
    details: str
    severity: str = "info"

class LogOut(LogCreate):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class AlertOut(BaseModel):
    id: int
    rule_triggered: str
    server_id: str
    severity: str
    timestamp: datetime

    class Config:
        from_attributes = True