import { useState, useEffect } from 'react';
import { Log } from '../data/mockLogs';
import { wsService } from '../services/websocket';

export function useLiveEvents(initialLogs: Log[] = [], isPaused: boolean = false) {
  const [logs, setLogs] = useState<Log[]>(initialLogs);

  useEffect(() => {
    if (initialLogs.length > 0 && logs.length === 0) {
      setLogs(initialLogs);
    }
  }, [initialLogs]);

  useEffect(() => {
    wsService.connect();

    const unsubscribe = wsService.subscribe((newLog) => {
      if (!isPaused) {
        setLogs((prev) => [newLog, ...prev].slice(0, 100)); // Keep last 100
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isPaused]);

  return logs;
}
