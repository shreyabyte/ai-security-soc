import random
import time
import requests

API_URL = "http://localhost:8000/logs"

SERVERS = ["server-1", "server-2", "server-3"]

EVENT_TYPES = [
    ("login_success", "info"),
    ("login_failed", "warning"),
    ("cpu_usage", "info"),
    ("file_access", "info"),
]

USERS = ["alice", "bob", "admin", "root", "guest"]
IPS = ["192.168.1.10", "203.0.113.5", "10.0.0.4", "172.16.0.9"]


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


def run():
    print("Log generator started. Sending logs every 3 seconds. Press Ctrl+C to stop.")
    while True:
        log = generate_log()
        try:
            response = requests.post(API_URL, json=log)
            print(f"Sent: {log} -> Status {response.status_code}")
        except requests.exceptions.ConnectionError:
            print("Backend not reachable. Is uvicorn running?")
        time.sleep(3)


if __name__ == "__main__":
    run()