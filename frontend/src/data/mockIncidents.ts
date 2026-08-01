export interface Incident {
  id: string;
  time: string;
  event: string;
  type: 'auth' | 'detection' | 'alert' | 'ai' | 'network';
}

export const mockIncidents: Incident[] = [
  { id: "INC-1", time: "10:32:04", event: "Multiple failed SSH authentication attempts detected from 192.168.1.24", type: "auth" },
  { id: "INC-2", time: "10:33:15", event: "Successful login to web-server-01 following brute force pattern", type: "auth" },
  { id: "INC-3", time: "10:33:18", event: "Critical alert generated: Brute-force attack detected", type: "alert" },
  { id: "INC-4", time: "10:33:20", event: "AI Analyst triggered for rapid assessment of EVT-1002", type: "ai" },
  { id: "INC-5", time: "10:34:05", event: "Unusual outbound connection initiated from web-server-01 to 45.33.12.99", type: "network" },
  { id: "INC-6", time: "10:35:12", event: "Malware signature match identified on payload from web-server-01", type: "detection" }
];