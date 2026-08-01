export interface Server {
  id: string;
  name: string;
  status: 'online' | 'warning' | 'offline';
  cpu: number;
  memory: number;
  disk: number;
  networkIn: number;
  networkOut: number;
  lastHeartbeat: string;
  alerts: number;
}

export const mockServers: Server[] = [
  {
    id: "SRV-01",
    name: "web-server-01",
    status: "online",
    cpu: 45,
    memory: 62,
    disk: 35,
    networkIn: 124,
    networkOut: 342,
    lastHeartbeat: new Date().toISOString(),
    alerts: 1
  },
  {
    id: "SRV-02",
    name: "db-server-02",
    status: "warning",
    cpu: 88,
    memory: 92,
    disk: 78,
    networkIn: 45,
    networkOut: 812,
    lastHeartbeat: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    alerts: 3
  },
  {
    id: "SRV-03",
    name: "app-server-03",
    status: "online",
    cpu: 22,
    memory: 45,
    disk: 50,
    networkIn: 56,
    networkOut: 89,
    lastHeartbeat: new Date().toISOString(),
    alerts: 0
  },
  {
    id: "SRV-04",
    name: "auth-server-01",
    status: "online",
    cpu: 15,
    memory: 30,
    disk: 25,
    networkIn: 12,
    networkOut: 14,
    lastHeartbeat: new Date().toISOString(),
    alerts: 1
  },
  {
    id: "SRV-05",
    name: "firewall-01",
    status: "online",
    cpu: 65,
    memory: 70,
    disk: 15,
    networkIn: 1250,
    networkOut: 1245,
    lastHeartbeat: new Date().toISOString(),
    alerts: 0
  },
  {
    id: "SRV-06",
    name: "backup-server-01",
    status: "warning",
    cpu: 95,
    memory: 85,
    disk: 98,
    networkIn: 450,
    networkOut: 20,
    lastHeartbeat: new Date().toISOString(),
    alerts: 1
  },
  {
    id: "SRV-07",
    name: "workstation-14",
    status: "online",
    cpu: 10,
    memory: 25,
    disk: 40,
    networkIn: 5,
    networkOut: 2,
    lastHeartbeat: new Date().toISOString(),
    alerts: 0
  },
  {
    id: "SRV-08",
    name: "dev-server-01",
    status: "offline",
    cpu: 0,
    memory: 0,
    disk: 0,
    networkIn: 0,
    networkOut: 0,
    lastHeartbeat: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    alerts: 2
  }
];