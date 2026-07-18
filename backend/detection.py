from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import models


def check_repeated_failed_logins(db: Session, log: models.Log):
    if log.event_type != "login_failed":
        return

    one_minute_ago = datetime.utcnow() - timedelta(minutes=1)
    recent_failures = (
        db.query(models.Log)
        .filter(
            models.Log.server_id == log.server_id,
            models.Log.event_type == "login_failed",
            models.Log.timestamp >= one_minute_ago,
        )
        .count()
    )

    if recent_failures >= 3:
        create_alert(db, "Repeated failed logins", log.server_id, "critical")


def check_high_cpu(db: Session, log: models.Log):
    if log.event_type != "cpu_usage":
        return

    try:
        cpu_value = int(log.details.split("=")[1].replace("%", ""))
    except (IndexError, ValueError):
        return

    if cpu_value > 85:
        create_alert(db, "High CPU usage", log.server_id, "critical")
    elif cpu_value > 60:
        create_alert(db, "Elevated CPU usage", log.server_id, "warning")


def create_alert(db: Session, rule_triggered: str, server_id: str, severity: str):
    alert = models.Alert(
        rule_triggered=rule_triggered,
        server_id=server_id,
        severity=severity,
    )
    db.add(alert)
    db.commit()


def run_detection(db: Session, log: models.Log):
    check_repeated_failed_logins(db, log)
    check_high_cpu(db, log)