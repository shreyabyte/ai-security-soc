import React from 'react';
import { Shield, Bell, User } from 'lucide-react';
import { Link } from 'wouter';

export function Navbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const [time, setTime] = React.useState(new Date().toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false }));

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false })), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-[#141414] border-b border-[#2F2F2F] z-40 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button className="md:hidden p-1.5 text-[#A1A1AA] hover:text-[#F5F5F5]" onClick={onMenuToggle}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded bg-[#1C1C1C] border border-[#2F2F2F] flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#F5F5F5]" />
          </div>
          <div>
            <h1 className="font-semibold text-[#F5F5F5] text-sm leading-none">AI SOC</h1>
            <p className="text-[11px] text-[#A1A1AA] hidden sm:block mt-0.5">Security Operations Center</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2 bg-[#1C1C1C] px-3 py-1 rounded border border-[#2F2F2F]">
        <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
        <span className="text-xs text-[#F5F5F5] font-medium">System Operational</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-block text-xs font-mono text-[#A1A1AA]">UTC {time}</span>
        
        <button className="relative p-1.5 text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#232323] rounded transition-colors" title="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#EF4444] rounded-full"></span>
        </button>

        <div className="w-7 h-7 rounded-full bg-[#232323] border border-[#2F2F2F] flex items-center justify-center text-[#F5F5F5]">
          <User className="w-3.5 h-3.5 text-[#A1A1AA]" />
        </div>
      </div>
    </nav>
  );
}

