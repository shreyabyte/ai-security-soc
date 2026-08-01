import React from 'react';
import { cn } from '@/lib/utils';
import { Severity } from '@/data/mockAlerts';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Severity | string;
  children: React.ReactNode;
}

export function Badge({ variant = 'info', className, children, ...props }: BadgeProps) {
  const variants = {
    critical: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30",
    high: "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/30",
    medium: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
    low: "bg-[#232323] text-[#A1A1AA] border-[#2F2F2F]",
    info: "bg-[#232323] text-[#A1A1AA] border-[#2F2F2F]",
    healthy: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-mono font-medium tracking-wide uppercase transition-colors",
        variants[variant as keyof typeof variants] || variants.info,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

