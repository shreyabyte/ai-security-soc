import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { ServerHealth } from '@/components/dashboard/ServerHealth';
import { LoadingState } from '@/components/common/LoadingState';

export default function Servers() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServers = () => {
      api.getServers().then(data => {
        setServers(data as any);
        setLoading(false);
      });
    };
    fetchServers();
    const interval = setInterval(fetchServers, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingState className="h-[calc(100vh-4rem)]" />;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Server Infrastructure</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time health monitoring of critical assets.</p>
      </div>
      
      <ServerHealth servers={servers} />
    </div>
  );
}