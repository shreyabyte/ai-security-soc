import { Severity } from './mockAlerts';

export type LogType = 'authentication' | 'malware' | 'network' | 'system' | 'policy';
export type LogStatus = 'detected' | 'blocked' | 'investigating' | 'resolved';

export interface Log {
  id: string;
  timestamp: string;
  severity: Severity;
  event: string;
  sourceIP: string;
  destination: string;
  type: LogType;
  status: LogStatus;
}

const generateMockLogs = (): Log[] => {
  const logs: Log[] = [];
  const now = Date.now();
  
  const types: LogType[] = ['authentication', 'network', 'system', 'malware', 'policy'];
  const statuses: LogStatus[] = ['detected', 'blocked', 'resolved'];
  
  for (let i = 0; i < 30; i++) {
    const isCritical = i % 15 === 0;
    const isHigh = i % 7 === 0 && !isCritical;
    const isMedium = i % 5 === 0 && !isCritical && !isHigh;
    
    let severity: Severity = 'info';
    if (isCritical) severity = 'critical';
    else if (isHigh) severity = 'high';
    else if (isMedium) severity = 'medium';
    else if (i % 2 === 0) severity = 'low';

    logs.push({
      id: `LOG-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      timestamp: new Date(now - i * 1000 * 45).toISOString(),
      severity,
      event: isCritical ? "Unauthorized access attempt" : isHigh ? "Suspicious payload detected" : "Connection established",
      sourceIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      destination: `10.0.0.${Math.floor(Math.random() * 255)}`,
      type: types[i % types.length],
      status: isCritical ? 'detected' : statuses[i % statuses.length]
    });
  }
  
  return logs;
};

export const mockLogs = generateMockLogs();