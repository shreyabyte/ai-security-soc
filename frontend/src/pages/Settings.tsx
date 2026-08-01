import React, { useState } from 'react';
import { Save, Bell, Shield, Network, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    toast.success('Settings saved successfully', {
      description: 'Your configuration has been applied locally.'
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Platform Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure SOC environment preferences and integrations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex flex-col gap-1">
          <TabButton icon={Eye} label="General Options" active={activeTab === 'general'} onClick={() => setActiveTab('general')} />
          <TabButton icon={Bell} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
          <TabButton icon={Network} label="API & Integrations" active={activeTab === 'api'} onClick={() => setActiveTab('api')} />
          <TabButton icon={Shield} label="Alert Thresholds" active={activeTab === 'thresholds'} onClick={() => setActiveTab('thresholds')} />
        </div>

        <div className="flex-1 bg-card border border-border rounded-lg p-6">
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-lg font-semibold text-foreground mb-4">General Configuration</h2>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">Dashboard Refresh Interval</label>
                  <select className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full max-w-sm">
                    <option value="10">10 seconds</option>
                    <option value="30">30 seconds</option>
                    <option value="60">1 minute (Default)</option>
                    <option value="300">5 minutes</option>
                  </select>
                  <p className="text-xs text-muted-foreground">How often aggregate metrics are polled from the server.</p>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between max-w-sm">
                    <div>
                      <label className="text-sm font-medium text-foreground">Theme Mode</label>
                      <p className="text-xs text-muted-foreground mt-1">Dark mode is enforced for SOC visibility.</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" name="toggle" id="toggle" checked disabled className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-background border-2 border-primary appearance-none cursor-not-allowed translate-x-5" />
                      <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-primary cursor-not-allowed opacity-50"></label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between max-w-sm">
                    <div>
                      <label className="text-sm font-medium text-foreground">Live Monitoring WebSocket</label>
                      <p className="text-xs text-muted-foreground mt-1">Stream raw events directly to dashboard.</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" name="ws-toggle" id="ws-toggle" defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer translate-x-5 border-primary" />
                      <label htmlFor="ws-toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-primary cursor-pointer"></label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-lg font-semibold text-foreground mb-4">API Connections</h2>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">FastAPI Backend Endpoint</label>
                  <input type="text" placeholder="https://api.your-soc.internal/v1" className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full max-w-md font-mono" />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">WebSocket Endpoint</label>
                  <input type="text" placeholder="wss://api.your-soc.internal/ws" className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full max-w-md font-mono" />
                </div>

                <div className="grid gap-2 pt-4 border-t border-border">
                  <label className="text-sm font-medium text-foreground">AI Service API Key</label>
                  <input type="password" placeholder="sk-..." className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full max-w-md font-mono" />
                  <p className="text-xs text-muted-foreground">Required for advanced AI Analyst investigations.</p>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'notifications' || activeTab === 'thresholds') && (
            <div className="py-8 text-center text-muted-foreground text-sm border border-dashed border-border rounded-md bg-background/50">
              Select other tabs to view their configuration.
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border flex justify-end">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors text-sm"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors text-left",
        active ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
      )}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
}