import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  ShieldAlert, 
  Globe, 
  Server, 
  BrainCircuit, 
  BarChart3, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/live-logs", label: "Live Logs", icon: Activity },
  { href: "/alerts", label: "Security Alerts", icon: ShieldAlert },
  { href: "/threat-intelligence", label: "Threat Intel", icon: Globe },
  { href: "/servers", label: "Server Health", icon: Server },
  { href: "/ai-investigation", label: "AI Analyst", icon: BrainCircuit },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
}

export function Sidebar({ expanded, onToggle, mobileOpen }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      <aside 
        className={cn(
          "fixed top-14 bottom-0 left-0 z-40 bg-[#141414] border-r border-[#2F2F2F] transition-all duration-200 ease-in-out flex flex-col",
          expanded ? "w-56" : "w-14",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center px-3 py-2 rounded transition-colors cursor-pointer group relative",
                  isActive 
                    ? "bg-[#1C1C1C] text-[#F5F5F5] border-l-2 border-[#22C55E]" 
                    : "text-[#A1A1AA] hover:bg-[#1C1C1C]/60 hover:text-[#F5F5F5]"
                )}>
                  <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-[#22C55E]" : "text-[#A1A1AA] group-hover:text-[#F5F5F5]")} />
                  
                  {expanded && (
                    <span className={cn(
                      "ml-3 text-xs whitespace-nowrap",
                      isActive ? "font-medium text-[#F5F5F5]" : "font-normal"
                    )}>
                      {item.label}
                    </span>
                  )}

                  {!expanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[#232323] border border-[#2F2F2F] text-[#F5F5F5] text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-3 border-t border-[#2F2F2F] bg-[#141414]">
          {expanded ? (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] text-[#A1A1AA]">
                <span>Log Stream</span>
                <span className="text-[#22C55E] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span> Active
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-[#A1A1AA]">
                <span>Throughput</span>
                <span className="font-mono text-[#F5F5F5]">1,240 /s</span>
              </div>
            </div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-[#22C55E] mx-auto" title="Log Stream Active" />
          )}
        </div>

        <button 
          onClick={onToggle}
          className="hidden md:flex absolute -right-3 top-5 w-5 h-5 bg-[#1C1C1C] border border-[#2F2F2F] rounded-full items-center justify-center text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#232323] transition-colors z-50"
        >
          {expanded ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
      </aside>
    </>
  );
}
