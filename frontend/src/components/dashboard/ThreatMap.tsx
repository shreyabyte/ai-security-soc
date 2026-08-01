import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export function ThreatMap() {
  // Simplified coordinates for visualization
  const connections = [
    { from: [20, 30], to: [70, 40], intensity: 'critical' }, // RU to US
    { from: [80, 50], to: [70, 40], intensity: 'high' },     // CN to US
    { from: [70, 40], to: [40, 20], intensity: 'medium' },   // US to BR
    { from: [50, 20], to: [70, 40], intensity: 'critical' }, // IR to US
    { from: [20, 30], to: [30, 70], intensity: 'high' },     // RU to EU
    { from: [80, 50], to: [30, 70], intensity: 'low' },      // CN to EU
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-0 relative overflow-hidden flex flex-col h-[220px]">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <Globe className="w-3.5 h-3.5 text-muted-foreground" />
        <h2 className="text-xs text-muted-foreground">Global Threat Activity</h2>
      </div>
      
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1.5"><span className="text-destructive">●</span> Origin</div>
        <div className="flex items-center gap-1.5"><span className="text-primary">●</span> Target</div>
      </div>

      <div className="relative w-full h-full flex-1 bg-[#050B14] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-30" preserveAspectRatio="none">
          {/* Abstract continents outline */}
          <path d="M 15 20 Q 25 15 35 25 T 45 40 Q 30 50 20 40 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
          <path d="M 60 15 Q 75 10 85 20 T 90 40 Q 75 50 65 35 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
          <path d="M 25 60 Q 35 55 40 70 T 30 85 Q 20 75 25 60 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
          <path d="M 65 60 Q 75 55 85 70 T 80 85 Q 60 75 65 60 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
        </svg>

        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-10" preserveAspectRatio="none">
          {connections.map((conn, i) => {
            const color = conn.intensity === 'critical' ? 'hsl(var(--destructive))' : 
                          conn.intensity === 'high' ? 'hsl(24 95% 53%)' : 
                          conn.intensity === 'medium' ? 'hsl(38 92% 50%)' : 'hsl(var(--primary))';
            
            // Calculate a curve path
            const dx = conn.to[0] - conn.from[0];
            const dy = conn.to[1] - conn.from[1];
            const midX = conn.from[0] + dx / 2 - dy * 0.2;
            const midY = conn.from[1] + dy / 2 + dx * 0.2;
            
            const path = `M ${conn.from[0]} ${conn.from[1]} Q ${midX} ${midY} ${conn.to[0]} ${conn.to[1]}`;
            
            return (
              <g key={i}>
                {/* Source ping */}
                <circle cx={conn.from[0]} cy={conn.from[1]} r="1" fill={color}>
                  <animate attributeName="r" values="0;3" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                  <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                </circle>
                <circle cx={conn.from[0]} cy={conn.from[1]} r="0.5" fill={color} />
                
                {/* Target ping */}
                <circle cx={conn.to[0]} cy={conn.to[1]} r="0.5" fill="hsl(var(--primary))" />
                
                {/* Connection line */}
                <path d={path} fill="none" stroke={color} strokeWidth="0.2" opacity="0.2" />
                <path d={path} fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="1 3" opacity="0.2">
                  <animate attributeName="stroke-dashoffset" values="4;0" dur="1s" repeatCount="indefinite" />
                </path>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
