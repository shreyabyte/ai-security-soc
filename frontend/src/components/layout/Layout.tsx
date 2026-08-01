import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex flex-col">
      <Navbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      
      <div className="flex-1 flex mt-14 relative">
        <Sidebar 
          expanded={sidebarExpanded} 
          onToggle={() => {
            setSidebarExpanded(!sidebarExpanded);
            if (mobileMenuOpen) setMobileMenuOpen(false);
          }}
          mobileOpen={mobileMenuOpen}
        />
        
        <main 
          className={cn(
            "flex-1 p-4 md:p-6 transition-all duration-200 ease-in-out w-full overflow-x-hidden",
            sidebarExpanded ? "md:ml-56" : "md:ml-14"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}