export const mockDashboard = {
  kpis: {
    threatLevel: { value: "HIGH", score: 78, trend: "+12%" },
    activeAlerts: { value: 23, trend: "+8" },
    criticalAlerts: { value: 6, trend: "+3" },
    eventsToday: { value: 1847, trend: "+234" },
    serversOnline: { value: "6/8", trend: "" },
    detectionAccuracy: { value: "97.3%", trend: "+0.4%" }
  },
  eventsOverTime: Array.from({ length: 24 }).map((_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    total: Math.floor(Math.random() * 500) + 100,
    critical: Math.floor(Math.random() * 20),
    high: Math.floor(Math.random() * 50) + 10,
    medium: Math.floor(Math.random() * 100) + 20
  })),
  severityDistribution: [
    { name: "Critical", value: 6, color: "hsl(var(--threat-critical))" },
    { name: "High", value: 14, color: "hsl(var(--threat-high))" },
    { name: "Medium", value: 35, color: "hsl(var(--threat-medium))" },
    { name: "Low", value: 82, color: "hsl(var(--threat-low))" }
  ],
  attackTypes: [
    { type: "Brute Force", count: 450 },
    { type: "Malware", count: 120 },
    { type: "Port Scan", count: 850 },
    { type: "Suspicious Login", count: 230 },
    { type: "Data Exfil", count: 45 },
    { type: "Phishing", count: 340 }
  ],
  threatTimeline: Array.from({ length: 24 }).map((_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    activity: Math.floor(Math.random() * 100)
  }))
};