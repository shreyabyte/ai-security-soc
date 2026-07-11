from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base

class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    server_id = Column(String, index=True)
    event_type = Column(String)
    details = Column(String)
    severity = Column(String, default="info")
    timestamp = Column(DateTime, default=datetime.utcnow)