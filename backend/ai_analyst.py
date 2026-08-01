"""
Rule-based "AI Analyst" logic.

This is NOT a call to an external LLM (no Gemini/OpenAI key required) — it's
deterministic analysis over the real logs/alerts already sitting in the
database. It replaces the frontend's old hardcoded/simulated responses with
answers grounded in live data. If you later add a Gemini API key, this module
is the natural place to swap in a real model call (see ask() below).
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import desc

import models

RULE_INFO = {
    "Repeated failed logins": {
        "risk_base": 80,
        "actions": [
            "Lock or force a password reset on the targeted account(s)",
            "Block the source IP at the perimeter firewall",
            "Review recent successful logins on the same host for signs of compromise",
        ],
    },
    "High CPU usage": {
        "risk_base": 70,
        "actions": [
            "Inspect running processes on the affected host",
            "Check for unauthorized crypto-mining or DoS activity",
            "Correlate with recent logins or file access on the same host",
        ],
    },
    "Elevated CPU usage": {
        "risk_base": 40,
        "actions": [
            "Monitor the host for continued CPU escalation",
            "Review scheduled jobs or recent deployments on the host",
        ],
    },
}

DEFAULT_ACTIONS = [
    "Review related log entries for the affected server",
    "Confirm whether the activity matches expected behavior for this host",
]

SEVERITY_RANK = {"critical": 2, "warning": 1, "info": 0}


def _top_alert(db: Session):
    """Most severe alert, tie-broken by most recent. Done in Python since
    severity is a plain string and 'warning' > 'critical' alphabetically."""
    alerts = db.query(models.Alert).order_by(desc(models.Alert.timestamp)).limit(50).all()
    if not alerts:
        return None
    return max(alerts, key=lambda a: (SEVERITY_RANK.get(a.severity, 0), a.timestamp))


def _risk_label(score: int) -> str:
    if score >= 70:
        return "Critical"
    if score >= 40:
        return "High"
    if score >= 15:
        return "Medium"
    return "Low"


def get_summary(db: Session) -> dict:
    """Builds a current risk summary from the most recent/severe alert."""
    top_alert = _top_alert(db)

    recent_window = datetime.utcnow() - timedelta(minutes=15)
    recent_critical_count = (
        db.query(models.Alert)
        .filter(models.Alert.severity == "critical", models.Alert.timestamp >= recent_window)
        .count()
    )

    if not top_alert:
        return {
            "current_focus": "Monitoring network traffic — no active alerts detected right now.",
            "risk_score": 5,
            "risk_label": _risk_label(5),
            "recommended_actions": ["No action needed. Continue passive monitoring."],
            "related_alert_id": None,
        }

    info = RULE_INFO.get(top_alert.rule_triggered, {"risk_base": 30, "actions": DEFAULT_ACTIONS})
    score = min(99, info["risk_base"] + recent_critical_count * 5)

    return {
        "current_focus": f"Investigating \"{top_alert.rule_triggered}\" on {top_alert.server_id}.",
        "risk_score": score,
        "risk_label": _risk_label(score),
        "recommended_actions": info["actions"],
        "related_alert_id": top_alert.id,
    }


def ask(db: Session, question: str) -> str:
    """
    Answers a free-text question using real data. Simple keyword routing —
    swap this function's body for a real LLM call (e.g. Gemini) later if
    you add an API key; keep the same signature so nothing else has to change.
    """
    q = question.lower()

    top_alert = _top_alert(db)
    alert_count = db.query(models.Alert).count()
    critical_count = db.query(models.Alert).filter(models.Alert.severity == "critical").count()

    if any(k in q for k in ["critical", "worst", "most severe", "top threat", "biggest threat"]):
        if top_alert:
            return (
                f'The most significant alert right now is "{top_alert.rule_triggered}" '
                f"on {top_alert.server_id}, severity {top_alert.severity}, "
                f"triggered at {top_alert.timestamp.strftime('%H:%M:%S')} UTC."
            )
        return "No alerts have been triggered yet — the environment currently looks clean."

    if any(k in q for k in ["block", "firewall", "ip"]):
        if top_alert:
            actions = RULE_INFO.get(top_alert.rule_triggered, {"actions": DEFAULT_ACTIONS})["actions"]
            return (
                f"For the current top alert (\"{top_alert.rule_triggered}\" on {top_alert.server_id}), "
                f"I'd recommend: {actions[0].lower()}."
            )
        return "There's no active alert to act on right now."

    if any(k in q for k in ["server", "cpu", "health", "infrastructure"]):
        busiest = (
            db.query(models.Log)
            .filter(models.Log.event_type == "cpu_usage")
            .order_by(desc(models.Log.timestamp))
            .first()
        )
        if busiest:
            return f"Most recent CPU reading: {busiest.server_id} reported \"{busiest.details}\" at {busiest.timestamp.strftime('%H:%M:%S')} UTC."
        return "No server CPU data has come in yet."

    if any(k in q for k in ["log", "recent", "activity", "event"]):
        recent = db.query(models.Log).order_by(desc(models.Log.timestamp)).first()
        return (
            f"Most recent event: {recent.event_type} on {recent.server_id} "
            f"({recent.severity}) — \"{recent.details}\"."
            if recent
            else "No log activity recorded yet."
        )

    # generic fallback grounded in real counts
    return (
        f"Currently tracking {alert_count} alert(s), {critical_count} critical. "
        + (
            f'Top priority: "{top_alert.rule_triggered}" on {top_alert.server_id}.'
            if top_alert
            else "No active alerts at the moment."
        )
    )
