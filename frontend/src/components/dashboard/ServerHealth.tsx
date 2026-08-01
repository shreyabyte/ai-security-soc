import React from 'react';
import { Server } from '@/data/mockServers';
import { Server as ServerIcon, Activity } from 'lucide-react';
import { StatusIndicator } from '@/components/common/StatusIndicator';
import { cn } from '@/lib/utils';

export function ServerHealth({ servers }: { servers: Server[] }) {
  const displayServers = servers.slice(0, 4);

  return (
    <div className="bg-[#1C1C1C] border border-[#2F2F2F] rounded p-4 flex flex-col justify-between h-full">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <ServerIcon className="w-4 h-4 text-[#A1A1AA]" />
          <h2 className="text-xs font-medium text-[#F5F5F5] uppercase tracking-wider">Server Infrastructure Health</h2>
        </div>
        <span className="text-[11px] font-mono text-[#22C55E]">
          6 / 8 Operational
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-1">
        {displayServers.map((server) => (
          <div key={server.id} className="bg-[#232323] border border-[#2F2F2F] rounded p-2.5 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <StatusIndicator status={server.status === 'online' ? 'healthy' : server.status === 'warning' ? 'warning' : 'offline'} pulse={server.status !== 'offline'} className="h-1.5 w-1.5" />
                <span className="font-mono text-xs font-medium text-[#F5F5F5] truncate">{server.name}</span>
              </div>
              {server.alerts > 0 ? (
                <span className="text-[10px] font-mono font-medium text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 px-1 py-0.2 rounded">
                  {server.alerts} alert
                </span>
              ) : (
                <span className="text-[10px] font-mono text-[#22C55E]">OK</span>
              )}
            </div>

            <div className="space-y-1.5">
              <ResourceRow label="CPU" value={server.cpu} />
              <ResourceRow label="RAM" value={server.memory} />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-[#2F2F2F] flex justify-between items-center text-[11px] text-[#A1A1AA] font-mono">
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-[#A1A1AA]" /> Total Bandwidth: 142 MB/s
        </span>
        <span className="text-[#A1A1AA]">Uptime 99.98%</span>
      </div>
    </div>
  );
}

function ResourceRow({ label, value }: { label: string, value: number }) {
  const isHigh = value > 80;
  const isWarning = value > 60 && value <= 80;
  
  const barColor = isHigh ? "bg-[#EF4444]" : isWarning ? "bg-[#F59E0B]" : "bg-[#22C55E]";
  
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-7 text-[#A1A1AA] font-mono">{label}</span>
      <div className="flex-1 h-1 bg-[#1C1C1C] rounded-full overflow-hidden border border-[#2F2F2F]/50">
        <div className={cn("h-full rounded-full transition-all duration-300", barColor)} style={{ width: `${value}%` }} />
      </div>
      <span className="w-8 text-right font-mono text-[#F5F5F5]">{value}%</span>
    </div>
  );
}

