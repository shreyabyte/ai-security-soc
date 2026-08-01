import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { LiveEvents } from '@/components/dashboard/LiveEvents';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { LoadingState } from '@/components/common/LoadingState';

export default function LiveLogs() {
  const [initialLogs, setInitialLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    api.getLogs().then(data => {
      setInitialLogs(data as any);
      setLoading(false);
    });
  }, []);

  const logs = useLiveEvents(initialLogs, isPaused);

  if (loading) return <LoadingState className="h-[calc(100vh-4rem)]" />;

  return (
    <div className="h-[calc(100vh-6rem)]">
      <LiveEvents 
        logs={logs} 
        isPaused={isPaused} 
        onTogglePause={() => setIsPaused(!isPaused)} 
      />
    </div>
  );
}