'use client'

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface TerminalHistoryProps {
  history: Array<{ command: string; output: string }>;
}

export function TerminalHistory({ history }: TerminalHistoryProps) {
  const [mounted, setMounted] = useState(false);
  const [sessionStart] = useState(new Date().toLocaleString());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="mb-8 p-4 font-mono text-sm terminal-input">
      <div className="flex flex-col space-y-4">
        {[...history].reverse().map((entry, index) => {
          const timestamp = mounted ? new Date().toLocaleTimeString() : '';
          return (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2 terminal-prompt">
              {mounted && <span className="terminal-timestamp">[{timestamp}]</span>}
              <code className="text-primary">{entry.command}</code>
            </div>
            <div 
              className={cn(
                "pl-6 whitespace-pre-wrap break-words typing-effect",
                entry.output.startsWith('Error') || entry.output.includes('not found') || entry.output.includes('No ') 
                  ? 'text-red-500' 
                  : 'text-white'
              )}
              style={{ 
                lineHeight: '1.5',
                maxWidth: '100%',
                overflowWrap: 'break-word',
                fontFamily: 'monospace',
                whiteSpace: 'pre',
                overflowX: 'auto'
              }}
              dangerouslySetInnerHTML={{ __html: entry.output }}
            />
          </div>
        )})}
      </div>
      <div className="mt-4 text-xs text-muted-foreground">
        {mounted && `System: RaceTerminal v1.0.0 | Session started at ${sessionStart}`}
      </div>
    </div>
  );
}