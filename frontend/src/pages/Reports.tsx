import React from 'react';
import { FileText, ShieldAlert, Download, Activity, Server } from 'lucide-react';
import { toast } from 'sonner';

export default function Reports() {
  const handleExport = (type: string) => {
    toast.info(`Generating ${type}...`, {
      description: "Feature coming soon — connect to FastAPI backend to enable report generation."
    });
  };

  const reports = [
    {
      id: "RPT-01",
      title: "Daily Security Report",
      description: "Summary of all security events, blocked threats, and active alerts from the last 24 hours.",
      icon: Activity,
      date: "Today, 08:00 UTC",
      color: "text-primary"
    },
    {
      id: "RPT-02",
      title: "Weekly Threat Intelligence",
      description: "Deep dive into detected attack vectors, prominent threat actors, and recommended posture adjustments.",
      icon: ShieldAlert,
      date: "Oct 24, 00:00 UTC",
      color: "text-destructive"
    },
    {
      id: "RPT-03",
      title: "Incident Summary: Brute Force Campaign",
      description: "Detailed timeline and AI analysis of the distributed SSH brute force campaign targeting infrastructure.",
      icon: FileText,
      date: "Oct 23, 14:30 UTC",
      color: "text-orange-400"
    },
    {
      id: "RPT-04",
      title: "Infrastructure Health Audit",
      description: "Comprehensive review of server uptime, resource utilization anomalies, and unpatched vulnerabilities.",
      icon: Server,
      date: "Oct 20, 00:00 UTC",
      color: "text-amber-400"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Compliance & Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate and export security reports for compliance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map(report => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="bg-card border border-border rounded-lg p-6 flex flex-col justify-between hover:border-primary/50 transition-colors group">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 bg-muted rounded-lg ${report.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground bg-background px-2 py-1 rounded border border-border">
                    {report.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{report.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {report.description}
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border flex gap-3">
                <button 
                  onClick={() => handleExport('PDF')}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-md font-medium text-sm transition-colors"
                >
                  <Download className="w-4 h-4" /> PDF
                </button>
                <button 
                  onClick={() => handleExport('CSV')}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-muted text-foreground hover:bg-muted-foreground/20 rounded-md font-medium text-sm transition-colors border border-border"
                >
                  <FileText className="w-4 h-4 text-muted-foreground" /> CSV
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}