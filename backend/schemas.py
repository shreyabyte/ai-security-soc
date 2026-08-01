from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

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


class AISummary(BaseModel):
    current_focus: str
    risk_score: int
    risk_label: str
    recommended_actions: List[str]
    related_alert_id: Optional[int] = None


class AIAskRequest(BaseModel):
    question: str


class AIAskResponse(BaseModel):
    answer: str