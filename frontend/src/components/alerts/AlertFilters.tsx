import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Severity } from '@/data/mockAlerts';

interface AlertFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  severityFilter: Severity | 'all';
  onSeverityChange: (val: Severity | 'all') => void;
  onRefresh: () => void;
}

export function AlertFilters({ searchTerm, onSearchChange, severityFilter, onSeverityChange, onRefresh }: AlertFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#1C1C1C] p-3 rounded border border-[#2F2F2F]">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
        <input 
          type="text" 
          placeholder="Search alerts by IP, host, or title..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#141414] border border-[#2F2F2F] rounded pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-[#22C55E] text-[#F5F5F5] placeholder:text-[#A1A1AA]"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#A1A1AA] hidden sm:block" />
          <select 
            value={severityFilter}
            onChange={(e) => onSeverityChange(e.target.value as any)}
            className="bg-[#141414] border border-[#2F2F2F] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#22C55E] text-[#F5F5F5] w-full sm:w-auto font-mono"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <button 
          onClick={onRefresh}
          className="p-1.5 bg-[#232323] hover:bg-[#2F2F2F] border border-[#2F2F2F] rounded transition-colors text-[#A1A1AA] hover:text-[#F5F5F5]"
          title="Refresh Alerts"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
