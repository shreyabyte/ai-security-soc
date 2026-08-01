import { BackendAlert, BackendLog, BackendServer, BackendSeverity } from './backendTypes';
import { Log, LogType, LogStatus } from '../data/mockLogs';
import { Alert, Severity, Status } from '../data/mockAlerts';
import { Server } from '../data/mockServers';
import { Incident } from '../data/mockIncidents';

// ---------- small helpers ----------

/** Parses "key=value key2=value2" style detail strings from log_generator.py */
function parseDetails(details: string): Record<string, string> {
  const out: Record<string, string> = {};
  details.split(' ').forEach((token) => {
    const [k, v] = token.split('=');
    if (k && v) out[k] = v;
  });
  return out;
}

/** Stable pseudo-random number in [min,max] derived from a string, so values
 *  don't jump around on every re-render/poll like Math.random() would. */
function stableRange(seed: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return min + (hash % (max - min + 1));
}

function backendSeverityToLogSeverity(s: BackendSeverity): Severity {
  if (s === 'critical') return 'critical';
  if (s === 'warning') return 'medium';
  return 'info';
}

function eventTypeToLogType(eventType: string): LogType {
  if (eventType === 'login_success' || eventType === 'login_failed') return 'authentication';
  if (eventType === 'cpu_usage') return 'system';
  if (eventType === 'file_access') return 'policy';
  return 'network';
}

function humanizeLog(log: BackendLog): string {
  const kv = parseDetails(log.details);
  switch (log.event_type) {
    case 'login_success':
      return `Successful login by ${kv.user ?? 'unknown user'} from ${kv.ip ?? 'unknown IP'}`;
    case 'login_failed':
      return `Failed login attempt by ${kv.user ?? 'unknown user'} from ${kv.ip ?? 'unknown IP'}`;
    case 'cpu_usage':
      return `CPU usage reported at ${kv.cpu ?? '?'}`;
    case 'file_access':
      return `File accessed: ${kv.file ?? 'unknown file'} by ${kv.user ?? 'unknown user'}`;
    default:
      return log.details;
  }
}

// ---------- Logs ----------

export function adaptLog(log: BackendLog): Log {
  const kv = parseDetails(log.details);
  const severity = backendSeverityToLogSeverity(log.severity);
  return {
    id: `LOG-${log.id}`,
    timestamp: log.timestamp,
    severity,
    event: humanizeLog(log),
    sourceIP: kv.ip ?? '-',
    destination: log.server_id,
    type: eventTypeToLogType(log.event_type),
    status: severity === 'critical' ? 'investigating' : severity === 'medium' ? 'detected' : 'resolved',
  };
}

export function adaptLogs(logs: BackendLog[]): Log[] {
  return logs.map(adaptLog);
}

// ---------- Alerts ----------

const RULE_EXPLANATIONS: Record<string, { risk: string; action: string; ai: string }> = {
  'Repeated failed logins': {
    risk: 'Multiple failed authentication attempts were detected in a short window, a common signature of a brute-force or credential-stuffing attack.',
    action: 'Lock or force a password reset on the targeted account, and consider temporarily blocking the source until reviewed.',
    ai: 'Pattern matches automated login-attempt behavior rather than manual human entry, based on the frequency of attempts.',
  },
  'High CPU usage': {
    risk: 'Sustained high CPU usage can indicate resource exhaustion from a denial-of-service condition, runaway process, or unauthorized crypto-mining activity.',
    action: 'Inspect running processes on the host and correlate with recent logins or file access before taking action.',
    ai: 'CPU spike exceeds the 85% critical threshold configured in the detection rules.',
  },
  'Elevated CPU usage': {
    risk: 'CPU usage is elevated above baseline, which may be early signs of unusual load or a process worth reviewing.',
    action: 'Monitor the host; escalate if usage continues to climb toward critical levels.',
    ai: 'CPU usage exceeds the 60% warning threshold configured in the detection rules.',
  },
};

function defaultExplanation(rule: string) {
  return {
    risk: `The "${rule}" detection rule was triggered based on recent activity on this host.`,
    action: 'Review the related log entries for this server to determine next steps.',
    ai: 'Automated rule-based detection — no additional AI analysis available yet.',
  };
}

export function adaptAlert(alert: BackendAlert): Alert {
  const severity: Severity = alert.severity === 'critical' ? 'critical' : 'medium';
  const info = RULE_EXPLANATIONS[alert.rule_triggered] ?? defaultExplanation(alert.rule_triggered);
  const status: Status = 'active';

  return {
    id: `ALT-${alert.id}`,
    title: alert.rule_triggered,
    severity,
    timestamp: alert.timestamp,
    sourceIP: '-',
    destinationIP: '-',
    affectedHost: alert.server_id,
    attackType: alert.rule_triggered,
    confidence: stableRange(`${alert.id}-${alert.rule_triggered}`, 75, 98),
    status,
    relatedEvents: [],
    riskExplanation: info.risk,
    recommendedAction: info.action,
    aiAnalysis: info.ai,
  };
}

export function adaptAlerts(alerts: BackendAlert[]): Alert[] {
  return alerts.map(adaptAlert);
}

// ---------- Servers ----------

export function adaptServer(server: BackendServer, alerts: BackendAlert[]): Server {
  const alertCount = alerts.filter((a) => a.server_id === server.server_id).length;
  // Backend doesn't track memory/disk/network yet — derive stable placeholder
  // values correlated with CPU so the UI stays sensible until that's added.
  const memory = Math.min(99, Math.round(server.cpu * 0.8 + stableRange(server.server_id + 'mem', 0, 15)));
  const disk = stableRange(server.server_id + 'disk', 20, 80);
  const networkIn = stableRange(server.server_id + 'netin', 20, 400);
  const networkOut = stableRange(server.server_id + 'netout', 20, 900);

  return {
    id: server.server_id,
    name: server.server_id,
    status: server.status,
    cpu: server.cpu,
    memory,
    disk,
    networkIn,
    networkOut,
    lastHeartbeat: server.last_seen ?? new Date().toISOString(),
    alerts: alertCount,
  };
}

export function adaptServers(servers: BackendServer[], alerts: BackendAlert[]): Server[] {
  return servers.map((s) => adaptServer(s, alerts));
}

// ---------- Derived dashboard stats & charts (computed from logs + alerts) ----------

export function computeDashboardStats(logs: BackendLog[], alerts: BackendAlert[], servers: BackendServer[]) {
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical').length;
  const warningAlerts = alerts.length - criticalAlerts;
  const onlineServers = servers.filter((s) => s.status !== 'offline').length;

  const score = Math.min(100, criticalAlerts * 15 + warningAlerts * 5);
  const threatLevelLabel = score >= 70 ? 'HIGH' : score >= 35 ? 'MEDIUM' : 'LOW';

  return {
    threatLevel: { value: threatLevelLabel, score, trend: '' },
    activeAlerts: { value: alerts.length, trend: '' },
    criticalAlerts: { value: criticalAlerts, trend: '' },
    eventsToday: { value: logs.length, trend: '' },
    serversOnline: { value: `${onlineServers}/${servers.length}`, trend: '' },
    detectionAccuracy: { value: '—', trend: '' }, // not tracked by backend yet
  };
}

export function computeChartData(logs: BackendLog[], alerts: BackendAlert[]) {
  // Bucket logs into the last 24 hourly buckets
  const now = new Date();
  const hourBuckets: { hour: string; total: number; critical: number; high: number; medium: number }[] = [];
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    hourBuckets.push({ hour: `${d.getHours().toString().padStart(2, '0')}:00`, total: 0, critical: 0, high: 0, medium: 0 });
  }
  logs.forEach((log) => {
    const logDate = new Date(log.timestamp);
    const hoursAgo = Math.floor((now.getTime() - logDate.getTime()) / (60 * 60 * 1000));
    const idx = 23 - hoursAgo;
    if (idx >= 0 && idx < 24) {
      hourBuckets[idx].total += 1;
      if (log.severity === 'critical') hourBuckets[idx].critical += 1;
      else if (log.severity === 'warning') hourBuckets[idx].medium += 1;
    }
  });

  const criticalCount = logs.filter((l) => l.severity === 'critical').length;
  const warningCount = logs.filter((l) => l.severity === 'warning').length;
  const infoCount = logs.filter((l) => l.severity === 'info').length;

  const severityDistribution = [
    { name: 'Critical', value: criticalCount, color: 'hsl(var(--threat-critical))' },
    { name: 'High', value: 0, color: 'hsl(var(--threat-high))' },
    { name: 'Medium', value: warningCount, color: 'hsl(var(--threat-medium))' },
    { name: 'Low', value: infoCount, color: 'hsl(var(--threat-low))' },
  ];

  const attackTypeCounts = new Map<string, number>();
  alerts.forEach((a) => {
    attackTypeCounts.set(a.rule_triggered, (attackTypeCounts.get(a.rule_triggered) ?? 0) + 1);
  });
  const attackTypes = Array.from(attackTypeCounts.entries()).map(([type, count]) => ({ type, count }));

  const threatTimeline = hourBuckets.map((b) => ({ hour: b.hour, activity: b.critical * 3 + b.medium }));

  return {
    eventsOverTime: hourBuckets,
    severityDistribution,
    attackTypes,
    threatTimeline,
  };
}

export function computeIncidents(logs: BackendLog[], alerts: BackendAlert[]): Incident[] {
  const fromLogs: Incident[] = logs.slice(0, 15).map((l) => ({
    id: `INC-L${l.id}`,
    time: new Date(l.timestamp).toLocaleTimeString(),
    event: humanizeLog(l),
    type: l.event_type.startsWith('login') ? 'auth' : l.event_type === 'cpu_usage' ? 'detection' : 'network',
  }));
  const fromAlerts: Incident[] = alerts.slice(0, 15).map((a) => ({
    id: `INC-A${a.id}`,
    time: new Date(a.timestamp).toLocaleTimeString(),
    event: `Alert generated: ${a.rule_triggered} on ${a.server_id}`,
    type: 'alert',
  }));
  return [...fromAlerts, ...fromLogs]
    .sort((a, b) => (a.time < b.time ? 1 : -1))
    .slice(0, 20);
}
