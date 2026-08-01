import React from 'react';
import { Alert } from '@/data/mockAlerts';
import { Badge } from '@/components/common/Badge';
import { 
  X, 
  ShieldAlert, 
  Crosshair, 
  Server, 
  Clock, 
  Activity,
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  ListRestart
} from 'lucide-react';
import { toast } from 'sonner';

interface AlertDetailsProps {
  alert: Alert;
  onClose: () => void;
}

export function AlertDetails({ alert, onClose }: AlertDetailsProps) {
  const handleAction = (action: string) => {
    toast.success(`Action initiated: ${action}`, {
      description: `Targeting alert ${alert.id}`,
    });
    if (action === 'Mark Resolved' || action === 'Ignore') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end bg-black/80 backdrop-blur-xs sm:pr-4 py-4 overflow-hidden">
      <div 
        className="w-full h-full sm:w-[500px] sm:max-h-full sm:rounded bg-[#1C1C1C] border border-[#2F2F2F] flex flex-col shadow-2xl animate-in slide-in-from-right-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-[#2F2F2F] bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded">
              <ShieldAlert className="w-5 h-5 text-[#EF4444]" />
            </div>
            <div>
              <h2 className="font-mono text-xs text-[#A1A1AA]">{alert.id}</h2>
              <div className="font-medium text-[#F5F5F5] text-sm">{alert.title}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#232323] rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex gap-2 items-center flex-wrap">
            <Badge variant={alert.severity}>{alert.severity} Severity</Badge>
            <Badge variant="info">{alert.attackType}</Badge>
            <Badge variant="info">{alert.status.toUpperCase()}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[11px] text-[#A1A1AA]">Source IP</span>
              <div className="flex items-center gap-2 font-mono text-xs bg-[#141414] p-2 rounded border border-[#2F2F2F] text-[#F5F5F5]">
                <Crosshair className="w-3.5 h-3.5 text-[#A1A1AA]" />
                {alert.sourceIP}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-[#A1A1AA]">Target Host</span>
              <div className="flex items-center gap-2 font-mono text-xs bg-[#141414] p-2 rounded border border-[#2F2F2F] text-[#F5F5F5]">
                <Server className="w-3.5 h-3.5 text-[#A1A1AA]" />
                {alert.affectedHost}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-[#A1A1AA]">Detection Time</span>
              <div className="flex items-center gap-2 font-mono text-xs bg-[#141414] p-2 rounded border border-[#2F2F2F] text-[#F5F5F5]">
                <Clock className="w-3.5 h-3.5 text-[#A1A1AA]" />
                {new Date(alert.timestamp).toLocaleTimeString([], { hour12: false })} UTC
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-[#A1A1AA]">Confidence</span>
              <div className="flex items-center gap-2 font-mono text-xs bg-[#141414] p-2 rounded border border-[#2F2F2F] text-[#F5F5F5]">
                <Activity className="w-3.5 h-3.5 text-[#A1A1AA]" />
                <span className={alert.confidence > 90 ? "text-[#EF4444] font-bold" : ""}>{alert.confidence}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs font-medium uppercase tracking-wider flex items-center gap-2 text-[#A1A1AA]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" /> Risk Explanation
            </h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed bg-[#141414] p-3 rounded border border-[#2F2F2F]">
              {alert.riskExplanation}
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs font-medium uppercase tracking-wider flex items-center gap-2 text-[#A1A1AA]">
              <BrainCircuit className="w-3.5 h-3.5 text-[#22C55E]" /> AI Analyst Telemetry
            </h3>
            <p className="text-xs text-[#F5F5F5] leading-relaxed bg-[#141414] p-3 rounded border border-[#22C55E]/30 font-mono">
              {alert.aiAnalysis}
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs font-medium uppercase tracking-wider flex items-center gap-2 text-[#A1A1AA]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> Recommended Mitigation
            </h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed bg-[#141414] p-3 rounded border border-[#2F2F2F]">
              {alert.recommendedAction}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-medium uppercase tracking-wider flex items-center gap-2 text-[#A1A1AA]">
              <ListRestart className="w-3.5 h-3.5" /> Related Log Correlates
            </h3>
            <div className="space-y-1.5">
              {alert.relatedEvents.map(event => (
                <div key={event} className="flex justify-between items-center text-xs font-mono bg-[#141414] p-2 rounded border border-[#2F2F2F]">
                  <span className="text-[#A1A1AA]">{event}</span>
                  <button className="text-[#22C55E] hover:underline text-[11px]">View Event</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#2F2F2F] bg-[#141414] grid grid-cols-2 gap-2.5">
          <button 
            onClick={() => handleAction('Investigate')}
            className="col-span-2 w-full py-2 bg-[#22C55E] text-[#0A0A0A] font-semibold rounded hover:bg-[#22C55E]/90 transition-colors text-xs uppercase font-mono"
          >
            Run Automated AI Playbook
          </button>
          <button 
            onClick={() => handleAction('Mark Resolved')}
            className="w-full py-2 bg-[#232323] border border-[#2F2F2F] text-[#F5F5F5] font-medium rounded hover:bg-[#2F2F2F] transition-colors text-xs"
          >
            Mark Resolved
          </button>
          <button 
            onClick={() => handleAction('Escalate')}
            className="w-full py-2 bg-[#232323] border border-[#2F2F2F] text-[#EF4444] font-medium rounded hover:bg-[#2F2F2F] transition-colors text-xs"
          >
            Escalate Incident
          </button>
        </div>
      </div>
    </div>
  );
}

