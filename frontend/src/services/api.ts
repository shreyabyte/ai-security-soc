import { backendClient } from './backendClient';
import {
  adaptLogs,
  adaptAlerts,
  adaptServers,
  computeDashboardStats,
  computeChartData,
  computeIncidents,
} from './adapters';
import { mockThreats } from '../data/mockThreats';

// Fetches raw data from the real backend once per call and adapts it into
// the shapes the UI components expect. Pages call these on mount / interval.
async function fetchRaw() {
  const [logs, alerts, servers] = await Promise.all([
    backendClient.getLogs(),
    backendClient.getAlerts(),
    backendClient.getServers(),
  ]);
  return { logs, alerts, servers };
}

export const api = {
  getAlerts: async () => {
    const { alerts } = await fetchRaw();
    return adaptAlerts(alerts);
  },
  getLogs: async () => {
    const { logs } = await fetchRaw();
    return adaptLogs(logs);
  },
  getServers: async () => {
    const { servers, alerts } = await fetchRaw();
    return adaptServers(servers, alerts);
  },
  getThreats: async () => {
    // No threat-intel feed in the backend yet — placeholder data.
    // Swap this out once/if the backend adds a threat-intel source.
    return mockThreats;
  },
  getIncidents: async () => {
    const { logs, alerts } = await fetchRaw();
    return computeIncidents(logs, alerts);
  },
  getDashboardStats: async () => {
    const { logs, alerts, servers } = await fetchRaw();
    return computeDashboardStats(logs, alerts, servers);
  },
  getChartData: async () => {
    const { logs, alerts } = await fetchRaw();
    return computeChartData(logs, alerts);
  },
};
