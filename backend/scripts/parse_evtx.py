from Evtx.Evtx import Evtx
import xml.etree.ElementTree as ET
import csv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DEFAULT_INPUT_FILE = BASE_DIR / "data" / "CA_4624_4625_LogonType2_LogonProc_chrome.evtx"
OUTPUT_FILE = BASE_DIR / "data" / "auth_logs.csv"

NS = {"e": "http://schemas.microsoft.com/win/2004/08/events/event"}

rows = []

INPUT_FILE = DEFAULT_INPUT_FILE
if not INPUT_FILE.exists():
    evtx_files = sorted((BASE_DIR / "data").glob("*.evtx"))
    if not evtx_files:
        raise FileNotFoundError(
            f"No EVTX files found in {BASE_DIR / 'data'} and default file {DEFAULT_INPUT_FILE} does not exist."
        )
    INPUT_FILE = evtx_files[0]
    print(f"Using EVTX file: {INPUT_FILE.name}")

with Evtx(INPUT_FILE) as log:
    for record in log.records():
        try:
            root = ET.fromstring(record.xml())
        except ET.ParseError:
            continue

        event_id_node = root.find("e:System/e:EventID", NS)
        if event_id_node is None:
            continue
        event_id = event_id_node.text
        if event_id not in ("4624", "4625"):
            continue

        time_node = root.find("e:System/e:TimeCreated", NS)
        computer_node = root.find("e:System/e:Computer", NS)
        if time_node is None or computer_node is None:
            continue

        timestamp = time_node.attrib.get("SystemTime")
        if not timestamp:
            continue

        server = computer_node.text or "unknown"

        data = {}
        for item in root.findall("e:EventData/e:Data", NS):
            name = item.attrib.get("Name") or ""
            data[name] = item.text or ""

        rows.append({
            "timestamp": timestamp,
            "server_id": server,
            "event_type": "login_success" if event_id == "4624" else "login_failed",
            "details": (
                f"user={data.get('TargetUserName', '-') or '-'} "
                f"process={data.get('LogonProcessName', '-') or '-'} "
                f"ip={data.get('IpAddress', '-') or '-'}"
            ),
            "severity": "info" if event_id == "4624" else "warning",
        })

with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(
        f,
        fieldnames=[
            "timestamp",
            "server_id",
            "event_type",
            "details",
            "severity",
        ],
    )
    writer.writeheader()
    writer.writerows(rows)

print(f"Exported {len(rows)} logs to {OUTPUT_FILE}")