// These mirror the FastAPI backend's Pydantic schemas exactly (schemas.py).
// Keep in sync with backend/schemas.py.

export type BackendSeverity = 'info' | 'warning' | 'critical';

export interface BackendLog {
  id: number;
  server_id: string;
  event_type: string; // e.g. "login_success" | "login_failed" | "cpu_usage" | "file_access"
  details: string;
  severity: BackendSeverity;
  timestamp: string;
}

export interface BackendAlert {
  id: number;
  rule_triggered: string;
  server_id: string;
  severity: BackendSeverity;
  timestamp: string;
}

export interface BackendServer {
  server_id: string;
  status: 'online' | 'warning' | 'offline';
  cpu: number;
  last_seen: string | null;
}
