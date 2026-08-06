"""
AI Analyst logic.

Primary path: calls Gemini, grounded in real logs/alerts pulled from the
database (see _gather_context()). Gemini is instructed to answer ONLY from
that data, so responses stay factual instead of hallucinated.

Fallback path: if the Gemini call fails (no API key set, network issue,
rate limit, timeout), we fall back to the original deterministic
keyword-based logic (_ask_rule_based) so the demo never breaks.
"""

import os
from datetime import datetime, timedelta

from dotenv import load_dotenv
from sqlalchemy.orm import Session
from sqlalchemy import desc

import models

load_dotenv()

# --- Gemini setup -----------------------------------------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
_gemini_model = None

if GEMINI_API_KEY:
    import google.generativeai as genai

    genai.configure(api_key=GEMINI_API_KEY)
    _gemini_model = genai.GenerativeModel("gemini-2.0-flash")


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


# --- Rule-based logic (kept as fallback) ------------------------------------

def _ask_rule_based(db: Session, question: str) -> str:
    """
    Original deterministic keyword-routing logic. Used as a fallback if the
    Gemini call fails, and can also be called directly for testing.
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


# --- Gemini-backed logic (primary) ------------------------------------------

def _gather_context(db: Session) -> str:
    """
    Pulls real, current data from the database and formats it as plain text
    for Gemini to read. This is what keeps answers grounded in real data
    instead of the model guessing or making things up.
    """
    recent_alerts = (
        db.query(models.Alert).order_by(desc(models.Alert.timestamp)).limit(10).all()
    )
    recent_logs = (
        db.query(models.Log).order_by(desc(models.Log.timestamp)).limit(20).all()
    )
    alert_count = db.query(models.Alert).count()
    critical_count = db.query(models.Alert).filter(models.Alert.severity == "critical").count()

    alert_lines = "\n".join(
        f"- [{a.timestamp.strftime('%H:%M:%S')} UTC] {a.rule_triggered} on {a.server_id} "
        f"(severity: {a.severity})"
        for a in recent_alerts
    ) or "No alerts recorded."

    log_lines = "\n".join(
        f"- [{l.timestamp.strftime('%H:%M:%S')} UTC] {l.event_type} on {l.server_id} "
        f"({l.severity}): {l.details}"
        for l in recent_logs
    ) or "No log activity recorded."

    return f"""SUMMARY: {alert_count} total alert(s), {critical_count} critical.

RECENT ALERTS (most recent first):
{alert_lines}

RECENT LOG ACTIVITY (most recent first):
{log_lines}"""


def ask(db: Session, question: str) -> str:
    """
    Answers a free-text question using real data.

    Primary path: Gemini, grounded in _gather_context(). Falls back to the
    original rule-based logic if no API key is set or the call fails for
    any reason (network issue, rate limit, timeout) — so the demo never
    breaks on a bad connection.
    """
    if not _gemini_model:
        return _ask_rule_based(db, question)

    context = _gather_context(db)

    prompt = f"""You are a security analyst assistant for a SOC (Security Operations Center) dashboard.
Answer the user's question using ONLY the data provided below. Do not invent
alerts, logs, servers, or numbers that are not present in the data.
If the data doesn't contain enough information to answer, say so honestly.

DATA:
{context}

QUESTION:
{question}

Give a clear, concise answer in plain English (2-4 sentences), referencing
specific values from the data (server names, timestamps, severities) where
relevant."""

    try:
        response = _gemini_model.generate_content(prompt)
        text = (response.text or "").strip()
        return text if text else _ask_rule_based(db, question)
    except Exception:
        return _ask_rule_based(db, question)