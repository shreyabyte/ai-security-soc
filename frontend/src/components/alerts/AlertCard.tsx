import React from 'react';
import { Alert } from '@/data/mockAlerts';
import { Badge } from '@/components/common/Badge';
import { Crosshair, Server, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface AlertCardProps {
  alert: Alert;
  onClick: (alert: Alert) => void;
  compact?: boolean;
}

export function AlertCard({ alert, onClick, compact = false }: AlertCardProps) {
  return (
    <div 
      onClick={() => onClick(alert)}
      className="bg-[#1C1C1C] border border-[#2F2F2F] rounded p-3 hover:bg-[#232323] transition-colors cursor-pointer group flex flex-col gap-2"
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={alert.severity}>{alert.severity}</Badge>
            <span className="text-[11px] text-[#A1A1AA] font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
            </span>
          </div>
          <h3 className="font-medium text-[#F5F5F5] text-xs truncate group-hover:text-[#22C55E] transition-colors">{alert.title}</h3>
        </div>
        <div className={cn(
          "text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border flex-shrink-0",
          alert.status === 'active' ? "border-[#EF4444]/40 text-[#EF4444] bg-[#EF4444]/10" :
          alert.status === 'investigating' ? "border-[#F59E0B]/40 text-[#F59E0B] bg-[#F59E0B]/10" :
          "border-[#2F2F2F] text-[#A1A1AA] bg-[#232323]"
        )}>
          {alert.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-[#A1A1AA]">
        <div className="flex items-center gap-1.5 truncate">
          <Crosshair className="w-3 h-3 flex-shrink-0 text-[#A1A1AA]" />
          <span className="font-mono text-[11px] truncate">{alert.sourceIP}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <Server className="w-3 h-3 flex-shrink-0 text-[#A1A1AA]" />
          <span className="font-mono text-[11px] truncate">{alert.affectedHost}</span>
        </div>
      </div>

      {!compact && (
        <div className="pt-2 border-t border-[#2F2F2F] flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 text-[#A1A1AA] text-[11px]">
            <span>Confidence:</span>
            <span className={cn(
              "font-mono font-medium",
              alert.confidence > 90 ? "text-[#EF4444]" : "text-[#F5F5F5]"
            )}>{alert.confidence}%</span>
          </div>
          <div className="text-[#A1A1AA] group-hover:text-[#F5F5F5] text-[11px] font-medium flex items-center gap-1">
            Investigate <ChevronRight className="w-3 h-3 text-[#22C55E]" />
          </div>
        </div>
      )}
    </div>
  );
}

