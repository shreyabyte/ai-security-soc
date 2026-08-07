import csv
import sys
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from database import SessionLocal, engine
import models
import detection

models.Base.metadata.create_all(bind=engine)
CSV_FILE = BASE_DIR / "data" / "auth_logs.csv"


def parse_timestamp(ts: str) -> datetime | None:
    try:
        if ts.endswith("Z"):
            ts = ts[:-1] + "+00:00"
        return datetime.fromisoformat(ts)
    except ValueError:
        return None


def main() -> None:
    if not CSV_FILE.exists():
        raise FileNotFoundError(f"CSV file not found: {CSV_FILE}")

    session = SessionLocal()
    try:
        print("Clearing existing logs and alerts...")
        session.query(models.Alert).delete()
        session.query(models.Log).delete()
        session.commit()

        inserted = 0
        with CSV_FILE.open(newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                timestamp = parse_timestamp(row["timestamp"])
                if timestamp is None:
                    print(f"Skipping invalid timestamp: {row['timestamp']}")
                    continue

                log = models.Log(
                    server_id=row["server_id"],
                    event_type=row["event_type"],
                    details=row["details"],
                    severity=row["severity"],
                    timestamp=timestamp,
                )
                session.add(log)
                session.commit()
                session.refresh(log)
                detection.run_detection(session, log)
                inserted += 1

        print(f"Imported {inserted} logs from {CSV_FILE}")
    finally:
        session.close()


if __name__ == "__main__":
    main()
