import React from 'react';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: 'critical' | 'high' | 'medium' | 'low' | 'healthy' | 'offline' | 'warning';
  pulse?: boolean;
}

export function StatusIndicator({ status, pulse = false, className, ...props }: StatusIndicatorProps) {
  const colors = {
    critical: "bg-destructive",
    high: "bg-orange-500",
    medium: "bg-amber-500",
    low: "bg-blue-500",
    healthy: "bg-[#22C55E]",
    offline: "bg-destructive",
    warning: "bg-amber-500",
  };

  return (
    <div className={cn("relative flex h-2 w-2", className)} {...props}>
      {pulse && (
        <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", colors[status])}></span>
      )}
      <span className={cn("relative inline-flex rounded-full h-2 w-2", colors[status])}></span>
    </div>
  );
}