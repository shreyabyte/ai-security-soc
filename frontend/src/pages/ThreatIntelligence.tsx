import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { LoadingState } from '@/components/common/LoadingState';
import { Badge } from '@/components/common/Badge';
import { Search, ShieldBan, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function ThreatIntelligence() {
  const [threats, setThreats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.getThreats().then(data => {
      setThreats(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState className="h-[calc(100vh-4rem)]" />;

  const filteredThreats = threats.filter(t => 
    t.indicator.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBlock = (indicator: string) => {
    toast.success(`Block rule applied for ${indicator}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Threat Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">Known malicious indicators and IoCs.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search indicators or tags..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/20 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
              <tr>
                <th className="p-4">Indicator</th>
                <th className="p-4">Type</th>
                <th className="p-4">Risk</th>
                <th className="p-4">Tags</th>
                <th className="p-4">Occurrences</th>
                <th className="p-4">Last Seen</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredThreats.map((threat) => (
                <tr key={threat.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-mono font-medium text-foreground">{threat.indicator}</td>
                  <td className="p-4 uppercase text-xs text-muted-foreground">{threat.type}</td>
                  <td className="p-4"><Badge variant={threat.risk}>{threat.risk}</Badge></td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {threat.tags.map((tag: string) => (
                        <span key={tag} className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-muted rounded border border-border text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 font-mono">{threat.occurrences}</td>
                  <td className="p-4 text-muted-foreground">{new Date(threat.lastSeen).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => toast.info(`Investigating ${threat.indicator}...`)}
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                        title="Investigate"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleBlock(threat.indicator)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                        title="Block Indicator"
                      >
                        <ShieldBan className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredThreats.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">No threats matched your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}