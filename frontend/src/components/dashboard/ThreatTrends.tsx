import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

export function ThreatTrends({ data }: { data?: any[] }) {
  const chartData = data || Array.from({ length: 12 }).map((_, i) => ({
    time: `${(i * 2).toString().padStart(2, '0')}:00`,
    events: Math.floor(Math.random() * 200) + 150,
    critical: Math.floor(Math.random() * 12) + 2
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#232323] border border-[#2F2F2F] p-2.5 rounded shadow-none text-xs font-mono">
          <p className="text-[#A1A1AA] mb-1 font-semibold">{label} UTC</p>
          <div className="space-y-0.5">
            <p className="text-[#F5F5F5] flex justify-between gap-4">
              <span>Events:</span> <span className="font-bold">{payload[0]?.value}</span>
            </p>
            <p className="text-[#EF4444] flex justify-between gap-4">
              <span>Critical:</span> <span className="font-bold">{payload[1]?.value}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#1C1C1C] border border-[#2F2F2F] rounded p-4 flex flex-col h-full justify-between">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#A1A1AA]" />
          <h2 className="text-xs font-medium text-[#F5F5F5] uppercase tracking-wider">Threat Trends (24h)</h2>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-[#A1A1AA]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-[#22C55E]"></span> Velocity
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-[#EF4444]"></span> Critical
          </span>
        </div>
      </div>

      <div className="h-[140px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#2F2F2F" vertical={false} />
            <XAxis dataKey="time" stroke="#A1A1AA" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#A1A1AA" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="events" stroke="#22C55E" strokeWidth={1.5} fill="#22C55E" fillOpacity={0.08} />
            <Area type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={1.5} fill="#EF4444" fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
