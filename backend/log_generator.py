import random
import threading
import time
from typing import Optional

from database import SessionLocal
import detection
import models

SERVERS = ["server-1", "server-2", "server-3"]

EVENT_TYPES = [
    ("login_success", "info"),
    ("login_failed", "warning"),
    ("cpu_usage", "info"),
    ("file_access", "info"),
]

USERS = ["alice", "bob", "admin", "root", "guest"]
IPS = ["192.168.1.10", "203.0.113.5", "10.0.0.4", "172.16.0.9"]

_generator_thread: Optional[threading.Thread] = None
_generator_started = False
_stop_event = threading.Event()


def generate_log():
    server_id = random.choice(SERVERS)
    event_type, severity = random.choice(EVENT_TYPES)

    if event_type == "cpu_usage":
        cpu = random.randint(10, 100)
        details = f"cpu={cpu}%"
        if cpu > 85:
            severity = "critical"
        elif cpu > 60:
            severity = "warning"
    elif event_type in ("login_success", "login_failed"):
        user = random.choice(USERS)
        ip = random.choice(IPS)
        details = f"user={user} ip={ip}"
    else:
        details = f"file=/etc/passwd user={random.choice(USERS)}"

    return {
        "server_id": server_id,
        "event_type": event_type,
        "details": details,
        "severity": severity,
    }


def _insert_generated_log():
    db = SessionLocal()
    try:
        log_payload = generate_log()
        db_log = models.Log(**log_payload)
        db.add(db_log)
        db.commit()
        db.refresh(db_log)

        detection.run_detection(db, db_log)
    finally:
        db.close()


def run():
    print("Log generator started. Inserting logs every 3 seconds.")
    while not _stop_event.is_set():
        try:
            _insert_generated_log()
            print("Generated log")
        except Exception as exc:
            print(f"Log generation failed: {exc}")

        if _stop_event.wait(3):
            break


def start_background_generator():
    global _generator_thread, _generator_started

    if _generator_started:
        return _generator_thread

    _generator_started = True
    _stop_event.clear()
    _generator_thread = threading.Thread(target=run, name="log-generator", daemon=True)
    _generator_thread.start()
    return _generator_thread


def stop_background_generator():
    global _generator_started

    _stop_event.set()
    if _generator_thread and _generator_thread.is_alive():
        _generator_thread.join(timeout=1)
    _generator_started = False
    return _generator_thread


if __name__ == "__main__":
    start_background_generator()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        stop_background_generator()