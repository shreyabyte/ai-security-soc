export interface Threat {
  id: string;
  indicator: string;
  type: 'ip' | 'domain' | 'hash';
  risk: 'critical' | 'high' | 'medium' | 'low';
  country: string;
  firstSeen: string;
  lastSeen: string;
  occurrences: number;
  tags: string[];
}

export const mockThreats: Threat[] = [
  {
    id: "THR-101",
    indicator: "192.168.1.24",
    type: "ip",
    risk: "critical",
    country: "RU",
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    lastSeen: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    occurrences: 1450,
    tags: ["brute-force", "ssh", "scanner"]
  },
  {
    id: "THR-102",
    indicator: "evil-c2-domain.com",
    type: "domain",
    risk: "critical",
    country: "UNKNOWN",
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    lastSeen: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    occurrences: 45,
    tags: ["c2", "malware", "botnet"]
  },
  {
    id: "THR-103",
    indicator: "8d5c4e...",
    type: "hash",
    risk: "high",
    country: "N/A",
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    occurrences: 12,
    tags: ["ransomware", "wannacry", "executable"]
  },
  {
    id: "THR-104",
    indicator: "45.33.12.99",
    type: "ip",
    risk: "high",
    country: "CN",
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    lastSeen: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    occurrences: 890,
    tags: ["exfiltration", "tor-exit"]
  },
  {
    id: "THR-105",
    indicator: "203.45.67.89",
    type: "ip",
    risk: "medium",
    country: "BR",
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    lastSeen: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    occurrences: 5400,
    tags: ["scanner", "recon"]
  }
];