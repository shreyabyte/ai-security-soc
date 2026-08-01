import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { LiveEvents } from '@/components/dashboard/LiveEvents';
import { AlertCard } from '@/components/alerts/AlertCard';
import { ServerHealth } from '@/components/dashboard/ServerHealth';
import { ThreatTrends } from '@/components/dashboard/ThreatTrends';
import { AIDetectionSummary } from '@/components/dashboard/AIDetectionSummary';
import { AlertDetails } from '@/components/alerts/AlertDetails';
import { LoadingState } from '@/components/common/LoadingState';
import { ShieldAlert, Server, Target, AlertOctagon, ChevronRight } from 'lucide-react';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { Link } from 'wouter';

export default function Overview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [isLivePaused, setIsLivePaused] = useState(false);
  
  const liveLogs = useLiveEvents(data?.logs || [], isLivePaused);

  useEffect(() => {
    async function fetchData(showLoading = true) {
      try {
        const [stats, alerts, logs, servers] = await Promise.all([
          api.getDashboardStats(),
          api.getAlerts(),
          api.getLogs(),
          api.getServers()
        ]);
        
        setData({ stats, alerts, logs, servers });
      } catch (e) {
        console.error("Failed to fetch dashboard data");
      } finally {
        if (showLoading) setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(() => fetchData(false), 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingState className="h-[calc(100vh-4rem)]" />;
  if (!data) return <div className="p-8 text-center text-[#A1A1AA]">No live data</div>;

  return (
    <div className="space-y-5">
      {/* Top Row: Threat Level, Active Alerts, Critical Alerts, Servers Online */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard 
          title="Threat Level" 
          value={`HIGH (${data.stats.threatLevel.score})`} 
          icon={ShieldAlert} 
          trend={data.stats.threatLevel.trend} 
          color="critical" 
        />
        <StatCard 
          title="Active Alerts" 
          value={data.stats.activeAlerts.value} 
          icon={AlertOctagon} 
          trend={data.stats.activeAlerts.trend} 
          color="medium"
        />
        <StatCard 
          title="Critical Alerts" 
          value={data.stats.criticalAlerts.value} 
          icon={Target} 
          trend={data.stats.criticalAlerts.trend} 
          color="critical" 
        />
        <StatCard 
          title="Servers Online" 
          value={data.stats.serversOnline.value} 
          icon={Server} 
          trend="" 
          subtitle="6 of 8 nodes operational"
          color="healthy" 
        />
      </div>

      {/* Middle Row: Live Logs (largest section), Recent Security Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 h-[420px]">
          <LiveEvents logs={liveLogs} isPaused={isLivePaused} onTogglePause={() => setIsLivePaused(!isLivePaused)} compact />
        </div>

        <div className="xl:col-span-1 bg-[#1C1C1C] border border-[#2F2F2F] rounded flex flex-col h-[420px]">
          <div className="p-3 border-b border-[#2F2F2F] bg-[#141414] flex justify-between items-center">
            <h2 className="text-xs font-medium text-[#F5F5F5] uppercase tracking-wider flex items-center gap-2">
              <AlertOctagon className="w-3.5 h-3.5 text-[#EF4444]" /> 
              Recent Security Alerts
            </h2>
            <Link href="/alerts" className="text-xs text-[#22C55E] hover:underline font-medium flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-3 space-y-2 overflow-y-auto flex-1 bg-[#1C1C1C]">
            {data.alerts.slice(0, 4).map((alert: any) => (
              <AlertCard key={alert.id} alert={alert} onClick={setSelectedAlert} compact />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Threat Trends, Server Health, AI Detection Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ThreatTrends />
        <ServerHealth servers={data.servers} />
        <AIDetectionSummary />
      </div>

      {selectedAlert && (
        <AlertDetails alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
      )}
    </div>
  );
}
