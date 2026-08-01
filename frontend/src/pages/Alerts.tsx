import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Alert, Severity } from '@/data/mockAlerts';
import { AlertCard } from '@/components/alerts/AlertCard';
import { AlertFilters } from '@/components/alerts/AlertFilters';
import { AlertDetails } from '@/components/alerts/AlertDetails';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { ShieldCheck } from 'lucide-react';

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');

  const fetchAlerts = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const data = await api.getAlerts();
    setAlerts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(() => fetchAlerts(false), 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.sourceIP.includes(searchTerm) ||
      alert.affectedHost.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-[#2F2F2F]">
        <div>
          <h1 className="text-base font-semibold text-[#F5F5F5] uppercase tracking-wider">Security Incident Alerts</h1>
          <p className="text-xs text-[#A1A1AA] mt-0.5">Real-time threat triage and incident investigation</p>
        </div>
        <div className="text-xs font-mono text-[#A1A1AA]">
          {filteredAlerts.length} Active Incidents
        </div>
      </div>

      <AlertFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        severityFilter={severityFilter}
        onSeverityChange={setSeverityFilter}
        onRefresh={fetchAlerts}
      />

      {loading ? (
        <LoadingState className="h-64" />
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-[#1C1C1C] border border-[#2F2F2F] rounded h-64 flex items-center justify-center">
          <EmptyState 
            icon={ShieldCheck} 
            title="No alerts found" 
            description="No security alerts match your current filters. Environment is secure." 
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAlerts.map(alert => (
            <AlertCard 
              key={alert.id} 
              alert={alert} 
              onClick={setSelectedAlert} 
            />
          ))}
        </div>
      )}

      {selectedAlert && (
        <AlertDetails 
          alert={selectedAlert} 
          onClose={() => setSelectedAlert(null)} 
        />
      )}
    </div>
  );
}
