import React from 'react';
import { cn } from '@/lib/utils';

export function LoadingState({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex space-x-2">
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}