import React from 'react';
import { Log } from '@/data/mockLogs';
import { Badge } from '@/components/common/Badge';
import { Link } from 'wouter';
import { Activity, Play, Pause, ExternalLink } from 'lucide-react';

interface LiveEventsProps {
  logs: Log[];
  isPaused: boolean;
  onTogglePause: () => void;
  compact?: boolean;
}

export function LiveEvents({ logs, isPaused, onTogglePause, compact = false }: LiveEventsProps) {
  const displayLogs = compact ? logs.slice(0, 8) : logs;

  return (
    <div className="bg-[#1C1C1C] border border-[#2F2F2F] rounded flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2F2F2F] bg-[#141414]">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-[#A1A1AA]" />
          <h2 className="text-xs font-medium text-[#F5F5F5] uppercase tracking-wider">Live Security Event Log</h2>
          <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 bg-[#1C1C1C] rounded border border-[#2F2F2F]">
            <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-[#A1A1AA]' : 'bg-[#22C55E]'}`}></span>
            <span className="text-[10px] font-mono text-[#A1A1AA] uppercase">{isPaused ? 'Paused' : 'Streaming'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button 
            onClick={onTogglePause}
            className="px-2 py-1 bg-[#232323] border border-[#2F2F2F] hover:bg-[#2F2F2F] rounded text-[#A1A1AA] hover:text-[#F5F5F5] text-xs font-mono transition-colors flex items-center gap-1"
            title={isPaused ? "Resume Stream" : "Pause Stream"}
          >
            {isPaused ? <Play className="w-3 h-3 text-[#22C55E]" /> : <Pause className="w-3 h-3" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
          {compact && (
            <Link href="/live-logs" className="p-1 hover:bg-[#232323] rounded text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors" title="Expand Full Screen">
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#1C1C1C]">
        {displayLogs.length === 0 ? (
          <div className="p-8 text-center text-[#A1A1AA] text-xs font-mono">No live event logs recorded</div>
        ) : (
          <div className="min-w-[680px]">
            <div className="grid grid-cols-[90px_85px_1fr_120px_120px_100px] gap-2 px-3 py-2 border-b border-[#2F2F2F] text-[10px] uppercase font-mono font-medium text-[#A1A1AA] bg-[#141414]/80 sticky top-0 z-10">
              <div>Time (UTC)</div>
              <div>Severity</div>
              <div>Event Description</div>
              <div>Source IP</div>
              <div>Target Host</div>
              <div>Category</div>
            </div>
            <div className="divide-y divide-[#2F2F2F]/60">
              {displayLogs.map((log) => (
                <div
                  key={log.id}
                  className="grid grid-cols-[90px_85px_1fr_120px_120px_100px] gap-2 px-3 py-2 text-xs items-center hover:bg-[#232323] transition-colors font-sans"
                >
                  <div className="text-[11px] text-[#A1A1AA] font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                  <div>
                    <Badge variant={log.severity}>{log.severity}</Badge>
                  </div>
                  <div className="truncate font-medium text-[#F5F5F5]" title={log.event}>
                    {log.event}
                  </div>
                  <div className="font-mono text-[11px] text-[#A1A1AA] truncate">{log.sourceIP}</div>
                  <div className="font-mono text-[11px] text-[#A1A1AA] truncate">{log.destination}</div>
                  <div className="text-[11px] text-[#A1A1AA] truncate">{log.type}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

