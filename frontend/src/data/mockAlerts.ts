export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type Status = 'active' | 'investigating' | 'resolved';

export interface Alert {
  id: string;
  title: string;
  severity: Severity;
  timestamp: string;
  sourceIP: string;
  destinationIP: string;
  affectedHost: string;
  attackType: string;
  confidence: number;
  status: Status;
  relatedEvents: string[];
  riskExplanation: string;
  recommendedAction: string;
  aiAnalysis: string;
}

export const mockAlerts: Alert[] = [
  {
    id: "ALT-8492-CR",
    title: "Brute-force attack detected",
    severity: "critical",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    sourceIP: "192.168.1.24",
    destinationIP: "10.0.0.12",
    affectedHost: "web-server-01",
    attackType: "Brute Force",
    confidence: 96,
    status: "active",
    relatedEvents: ["EVT-1002", "EVT-1003", "EVT-1004"],
    riskExplanation: "Multiple failed authentication attempts followed by a successful login indicating potential compromise of the web-server-01 host.",
    recommendedAction: "Isolate web-server-01, force password reset for affected accounts, and block source IP 192.168.1.24.",
    aiAnalysis: "Pattern matches known dictionary attack tool signatures. The attacker targeted default administrative accounts. Post-compromise activity shows lateral movement attempts."
  },
  {
    id: "ALT-8493-CR",
    title: "Malware signature detected",
    severity: "critical",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    sourceIP: "10.0.0.47",
    destinationIP: "Outbound",
    affectedHost: "db-server-02",
    attackType: "Malware",
    confidence: 98,
    status: "investigating",
    relatedEvents: ["EVT-2110"],
    riskExplanation: "Signature match for Ransom.WannaCry variant attempting to communicate with known C2 infrastructure.",
    recommendedAction: "Immediately disconnect db-server-02 from the network. Initiate incident response playbook for ransomware.",
    aiAnalysis: "Binary execution matches heuristic behaviors of ransomware. The process attempted to disable shadow copies before establishing outbound connections."
  },
  {
    id: "ALT-8494-HI",
    title: "Suspicious PowerShell execution",
    severity: "high",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    sourceIP: "192.168.2.105",
    destinationIP: "Internal",
    affectedHost: "workstation-14",
    attackType: "Execution",
    confidence: 87,
    status: "active",
    relatedEvents: ["EVT-3042", "EVT-3043"],
    riskExplanation: "Encoded PowerShell command executed bypassing execution policies, typical of fileless malware or advanced persistent threats.",
    recommendedAction: "Investigate workstation-14 user activity. Terminate suspicious PowerShell processes.",
    aiAnalysis: "The script attempted to download a payload from a recently registered domain. Base64 decoded string reveals reconnaissance commands."
  },
  {
    id: "ALT-8495-MD",
    title: "Port scanning detected",
    severity: "medium",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    sourceIP: "203.45.67.89",
    destinationIP: "10.0.0.1",
    affectedHost: "firewall-01",
    attackType: "Reconnaissance",
    confidence: 73,
    status: "resolved",
    relatedEvents: ["EVT-4101"],
    riskExplanation: "Sequential scanning of ports across the external perimeter, likely automated reconnaissance.",
    recommendedAction: "Ensure perimeter firewall rules are up to date. Monitor source IP for subsequent targeted attacks.",
    aiAnalysis: "Activity matches common scanning tools like Nmap. No successful connections were established during the scan window."
  },
  {
    id: "ALT-8496-HI",
    title: "Unusual outbound traffic",
    severity: "high",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    sourceIP: "192.168.3.200",
    destinationIP: "45.33.12.99",
    affectedHost: "app-server-03",
    attackType: "Data Exfiltration",
    confidence: 82,
    status: "active",
    relatedEvents: ["EVT-5012", "EVT-5013"],
    riskExplanation: "Large volume of encrypted traffic sent to an unfamiliar external IP address during non-business hours.",
    recommendedAction: "Block external IP 45.33.12.99 at the firewall. Inspect app-server-03 for unauthorized archives or staged data.",
    aiAnalysis: "Traffic volume exceeds the 99th percentile for this host. The destination IP is hosted on a bulletproof hosting provider."
  },
  {
    id: "ALT-8497-HI",
    title: "Multiple auth failures",
    severity: "high",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    sourceIP: "172.16.0.88",
    destinationIP: "10.0.0.15",
    affectedHost: "auth-server-01",
    attackType: "Brute Force",
    confidence: 91,
    status: "resolved",
    relatedEvents: ["EVT-6001", "EVT-6002", "EVT-6003"],
    riskExplanation: "Repeated failed login attempts for the 'admin' account from an internal IP address.",
    recommendedAction: "Verify if the activity was legitimate administrative action or credential stuffing. Implement account lockout policies.",
    aiAnalysis: "Attempts were clustered within a 2-minute window. The behavior suggests a misconfigured service rather than a malicious actor given the internal source."
  },
  {
    id: "ALT-8498-LW",
    title: "Configuration file modified",
    severity: "low",
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    sourceIP: "10.0.0.22",
    destinationIP: "10.0.0.12",
    affectedHost: "web-server-01",
    attackType: "System Modification",
    confidence: 99,
    status: "resolved",
    relatedEvents: ["EVT-7011"],
    riskExplanation: "Nginx configuration file was modified outside of standard change management windows.",
    recommendedAction: "Verify change with operations team.",
    aiAnalysis: "Modification aligns with typical CI/CD deployment patterns. Low risk."
  },
  {
    id: "ALT-8499-MD",
    title: "Suspicious API access",
    severity: "medium",
    timestamp: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    sourceIP: "198.51.100.24",
    destinationIP: "10.0.0.50",
    affectedHost: "api-gateway-01",
    attackType: "API Abuse",
    confidence: 68,
    status: "investigating",
    relatedEvents: ["EVT-8022"],
    riskExplanation: "Unusually high rate of requests to the user enumeration endpoint.",
    recommendedAction: "Implement rate limiting on the affected endpoint.",
    aiAnalysis: "Rate of requests is 15x normal baseline. Could indicate scraping or reconnaissance."
  }
];