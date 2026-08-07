import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_FILE = BASE_DIR / "data" / "auth_logs.csv"

SERVERS = ["server-1", "server-2", "server-3", "server-4", "server-5"]
USERS = [
    "alice",
    "bob",
    "charlie",
    "admin",
    "root",
    "eve",
    "mike",
    "jessica",
    "service_account",
    "guest",
]
IPS = [
    "10.0.0.5",
    "10.0.0.8",
    "10.0.0.12",
    "192.168.1.10",
    "172.16.0.23",
    "203.0.113.5",
    "198.51.100.7",
    "10.1.1.15",
]
FILES = [
    "/etc/passwd",
    "/var/log/auth.log",
    "/home/alice/report.pdf",
    "/home/bob/.ssh/authorized_keys",
    "/var/www/html/index.php",
    "/home/admin/.bash_history",
    "/home/charlie/finance.xlsx",
    "/var/log/syslog",
    "C:\\Windows\\System32\\config\\SAM",
    "C:\\Users\\admin\\Documents\\secret.docx",
]

ROW_COUNT = 1800
TARGET_COUNTS = {
    "login_success": int(ROW_COUNT * 0.55),
    "login_failed": int(ROW_COUNT * 0.15),
    "cpu_usage": int(ROW_COUNT * 0.20),
}
TARGET_COUNTS["file_access"] = ROW_COUNT - sum(TARGET_COUNTS.values())

START_TIME = datetime.utcnow() - timedelta(days=3)
rows = []

for burst_index in range(12):
    burst_size = random.randint(3, 6)
    server_id = random.choice(SERVERS)
    user = random.choice(USERS)
    ip = random.choice(IPS)
    burst_start = START_TIME + timedelta(minutes=random.randint(20 * burst_index, 25 * burst_index + 30))

    for attempt in range(burst_size):
        rows.append({
            "timestamp": (burst_start + timedelta(seconds=30 * attempt)).isoformat(timespec="seconds") + "Z",
            "server_id": server_id,
            "event_type": "login_failed",
            "details": f"user={user} ip={ip}",
            "severity": "warning",
        })

remaining_counts = TARGET_COUNTS.copy()
remaining_counts["login_failed"] = max(
    0, remaining_counts["login_failed"] - sum(1 for row in rows if row["event_type"] == "login_failed")
)

current_time = START_TIME
while sum(remaining_counts.values()) > 0:
    current_time += timedelta(seconds=random.randint(60, 240))
    event_type = random.choices(
        population=list(remaining_counts.keys()),
        weights=[remaining_counts[k] for k in remaining_counts],
        k=1,
    )[0]

    if remaining_counts[event_type] <= 0:
        continue

    if event_type == "login_success":
        details = f"user={random.choice(USERS)} ip={random.choice(IPS)}"
        severity = "info"
    elif event_type == "login_failed":
        details = f"user={random.choice(USERS)} ip={random.choice(IPS)}"
        severity = "warning"
    elif event_type == "cpu_usage":
        if random.random() < 0.12:
            cpu_value = random.randint(86, 98)
        else:
            cpu_value = random.randint(15, 70)
        details = f"cpu={cpu_value}%"
        if cpu_value > 85:
            severity = "critical"
        elif cpu_value > 60:
            severity = "warning"
        else:
            severity = "info"
    else:
        file_path = random.choice(FILES)
        user = random.choice(USERS)
        details = f"file={file_path} user={user}"
        severity = "warning" if file_path.endswith("SAM") or file_path.endswith("secret.docx") else "info"

    rows.append({
        "timestamp": current_time.isoformat(timespec="seconds") + "Z",
        "server_id": random.choice(SERVERS),
        "event_type": event_type,
        "details": details,
        "severity": severity,
    })
    remaining_counts[event_type] -= 1

rows.sort(key=lambda r: r["timestamp"])

with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["timestamp", "server_id", "event_type", "details", "severity"])
    writer.writeheader()
    writer.writerows(rows)

print(f"Generated {len(rows)} logs in {OUTPUT_FILE}")
