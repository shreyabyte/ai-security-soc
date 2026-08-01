import { Log } from '../data/mockLogs';
import { backendClient } from './backendClient';
import { adaptLog } from './adapters';
import { POLL_INTERVAL_MS } from './config';

// This used to be a fake WebSocket that generated random log events.
// It's now a lightweight poller against the real backend's GET /logs,
// exposing the same connect/disconnect/subscribe interface so the rest
// of the app (useLiveEvents) didn't need to change.
type Subscriber = (data: Log) => void;

class LiveLogService {
  private isConnected = false;
  private subscribers: Set<Subscriber> = new Set();
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private lastSeenId = -1;
  private firstPoll = true;

  connect() {
    if (this.isConnected) return;
    this.isConnected = true;
    this.poll(); // fetch immediately
    this.pollTimer = setInterval(() => this.poll(), POLL_INTERVAL_MS);
  }

  disconnect() {
    this.isConnected = false;
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  subscribe(callback: Subscriber) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private async poll() {
    try {
      const logs = await backendClient.getLogs();
      // logs come back newest-first from the backend
      const sorted = [...logs].sort((a, b) => a.id - b.id);

      if (this.firstPoll) {
        // Don't flood subscribers with the entire history on first load —
        // just remember where we are and start emitting from here on.
        this.lastSeenId = sorted.length ? sorted[sorted.length - 1].id : -1;
        this.firstPoll = false;
        return;
      }

      const newLogs = sorted.filter((l) => l.id > this.lastSeenId);
      if (newLogs.length === 0) return;

      this.lastSeenId = newLogs[newLogs.length - 1].id;
      newLogs.forEach((log) => {
        this.subscribers.forEach((sub) => sub(adaptLog(log)));
      });
    } catch (err) {
      console.error('Failed to poll logs from backend:', err);
    }
  }
}

export const wsService = new LiveLogService();
