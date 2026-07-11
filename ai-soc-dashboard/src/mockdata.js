export const mockLogs = [
  { id: 1, server_id: "server-1", event_type: "login_success", details: "user=alice ip=192.168.1.10", severity: "info", timestamp: "2026-07-11T10:00:00" },
  { id: 2, server_id: "server-2", event_type: "login_failed", details: "user=admin ip=203.0.113.5", severity: "warning", timestamp: "2026-07-11T10:01:12" },
  { id: 3, server_id: "server-1", event_type: "cpu_usage", details: "cpu=92%", severity: "critical", timestamp: "2026-07-11T10:01:45" },
  { id: 4, server_id: "server-3", event_type: "file_access", details: "file=/etc/passwd user=root", severity: "critical", timestamp: "2026-07-11T10:02:03" },
  { id: 5, server_id: "server-2", event_type: "login_failed", details: "user=admin ip=203.0.113.5", severity: "warning", timestamp: "2026-07-11T10:02:20" },
]

export const mockAlerts = [
  { id: 1, rule_triggered: "Repeated failed logins", server_id: "server-2", severity: "critical", timestamp: "2026-07-11T10:02:20" },
  { id: 2, rule_triggered: "High CPU usage", server_id: "server-1", severity: "warning", timestamp: "2026-07-11T10:01:45" },
]

export const mockServers = [
  { server_id: "server-1", status: "online", cpu: 92, last_seen: "2026-07-11T10:01:45" },
  { server_id: "server-2", status: "online", cpu: 34, last_seen: "2026-07-11T10:02:20" },
  { server_id: "server-3", status: "warning", cpu: 55, last_seen: "2026-07-11T10:02:03" },
]