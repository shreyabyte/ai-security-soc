import React from 'react';
import { AISecurityAnalyst } from '@/components/ai/AISecurityAnalyst';

export default function AIInvestigation() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">AI Security Analyst</h1>
        <p className="text-sm text-muted-foreground mt-1">Advanced contextual analysis and response recommendations.</p>
      </div>
      
      <AISecurityAnalyst />
    </div>
  );
}