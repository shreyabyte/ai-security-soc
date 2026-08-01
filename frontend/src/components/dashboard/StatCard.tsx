import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  color?: 'default' | 'critical' | 'high' | 'medium' | 'low' | 'healthy';
  className?: string;
  subtitle?: string;
}

export function StatCard({ title, value, icon: Icon, trend, trendDirection, color = 'default', className, subtitle }: StatCardProps) {
  const isUp = trend.startsWith('+') || trendDirection === 'up';
  const isDown = trend.startsWith('-') || trendDirection === 'down';
  
  const iconColors = {
    default: "text-[#A1A1AA]",
    critical: "text-[#EF4444]",
    high: "text-[#F97316]",
    medium: "text-[#F59E0B]",
    low: "text-[#A1A1AA]",
    healthy: "text-[#22C55E]",
  };

  const valueColors = {
    default: "text-[#F5F5F5]",
    critical: "text-[#EF4444]",
    high: "text-[#F5F5F5]",
    medium: "text-[#F5F5F5]",
    low: "text-[#F5F5F5]",
    healthy: "text-[#22C55E]",
  };

  return (
    <div className={cn("bg-[#1C1C1C] border border-[#2F2F2F] rounded p-4 flex flex-col justify-between", className)}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wider">{title}</h3>
        <Icon className={cn("w-4 h-4 flex-shrink-0", iconColors[color])} />
      </div>
      <div>
        <div className={cn("text-2xl font-bold tracking-tight font-mono", valueColors[color])}>
          {value}
        </div>
        <div className="flex items-center gap-1 mt-1 text-[11px]">
          {trend ? (
            <>
              {isUp ? <ArrowUpRight className="w-3 h-3 text-[#EF4444]" /> : 
               isDown ? <ArrowDownRight className="w-3 h-3 text-[#22C55E]" /> : 
               <Minus className="w-3 h-3 text-[#A1A1AA]" />}
              <span className={cn("font-medium font-mono", isUp ? "text-[#EF4444]" : isDown ? "text-[#22C55E]" : "text-[#A1A1AA]")}>
                {trend}
              </span>
              <span className="text-[#A1A1AA] ml-1">vs 24h ago</span>
            </>
          ) : (
            <span className="text-[#A1A1AA]">{subtitle || "All systems normal"}</span>
          )}
        </div>
      </div>
    </div>
  );
}

