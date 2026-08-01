import React from 'react';
import { BrainCircuit, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';

export function AIDetectionSummary() {
  return (
    <div className="bg-[#1C1C1C] border border-[#2F2F2F] rounded p-4 flex flex-col justify-between h-full">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-[#22C55E]" />
          <h2 className="text-xs font-medium text-[#F5F5F5] uppercase tracking-wider">AI Detection Summary</h2>
        </div>
        <span className="text-[10px] font-mono text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-1.5 py-0.5 rounded">
          Model v4.2 Active
        </span>
      </div>

      <div className="space-y-3 my-1">
        <div className="flex items-center justify-between p-2.5 bg-[#232323] border border-[#2F2F2F] rounded">
          <div>
            <div className="text-[11px] text-[#A1A1AA]">Detection Accuracy</div>
            <div className="text-lg font-bold font-mono text-[#F5F5F5]">97.3%</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-[#A1A1AA]">Avg Triage Time</div>
            <div className="text-sm font-bold font-mono text-[#22C55E]">1.4s</div>
          </div>
        </div>

        <div className="p-2.5 bg-[#232323]/50 border border-[#2F2F2F] rounded text-xs leading-relaxed text-[#A1A1AA]">
          <span className="text-[#F5F5F5] font-medium">Key Takeaway: </span>
          High confidence correlation (94%) detected between brute-force SSH attempts and egress outbound telemetry on web-server-01.
        </div>
      </div>

      <div className="pt-2 border-t border-[#2F2F2F] flex justify-between items-center">
        <span className="text-[11px] text-[#A1A1AA]">Automated triages today: <strong className="text-[#F5F5F5] font-mono">1,420</strong></span>
        <Link href="/ai-investigation" className="text-xs text-[#22C55E] hover:underline flex items-center gap-1 font-medium">
          Open AI Analyst <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
