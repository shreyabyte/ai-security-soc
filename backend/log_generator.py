import threading
import time
from typing import Optional

from database import SessionLocal
import detection
import models

import csv
from pathlib import Path


_generator_thread: Optional[threading.Thread] = None
_generator_started = False
_stop_event = threading.Event()

BASE_DIR = Path(__file__).resolve().parent
CSV_FILE = BASE_DIR / "data" / "auth_logs.csv"

with open(CSV_FILE, newline="", encoding="utf-8") as f:
    LOGS = list(csv.DictReader(f))

if not LOGS:
    raise ValueError("auth_logs.csv is empty")

current_index = 0

def generate_log():
    global current_index

    log = LOGS[current_index]

    current_index = (current_index + 1) % len(LOGS)

    return {
        "server_id": log["server_id"],
        "event_type": log["event_type"],
        "details": log["details"],
        "severity": log["severity"],
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