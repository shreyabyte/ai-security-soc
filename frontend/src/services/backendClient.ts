import { API_BASE_URL } from './config';
import { BackendAlert, BackendLog, BackendServer } from './backendTypes';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Backend request failed: ${path} (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const backendClient = {
  getLogs: () => get<BackendLog[]>('/logs'),
  getAlerts: () => get<BackendAlert[]>('/alerts'),
  getServers: () => get<BackendServer[]>('/servers'),
};
