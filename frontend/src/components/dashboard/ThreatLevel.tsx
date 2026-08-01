import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThreatLevel({ score }: { score: number }) {
  const data = [{ name: 'Risk', value: score, fill: 'hsl(var(--destructive))' }];
  
  return (
    <div className="bg-card border border-border rounded-lg p-6 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-destructive" />
          <h2 className="text-sm font-semibold text-foreground">Threat Level</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
          </span>
          <span className="text-destructive font-semibold text-sm">Critical</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="relative w-48 h-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" cy="50%" 
              innerRadius="70%" outerRadius="100%" 
              barSize={12} 
              data={data} 
              startAngle={180} endAngle={0}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background={{ fill: 'hsl(var(--muted))' }} dataKey="value" cornerRadius={6} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center -mt-8">
            <span className="text-4xl font-bold text-destructive">{score}</span>
            <span className="text-xs text-muted-foreground">Risk Score</span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-4">
          <ScoreBar label="Network" score={82} color="bg-destructive" />
          <ScoreBar label="Endpoint" score={71} color="bg-orange-500" />
          <ScoreBar label="Authentication" score={85} color="bg-destructive" />
          <ScoreBar label="Application" score={63} color="bg-amber-500" />
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, color }: { label: string, score: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium text-foreground">{score}/100</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
