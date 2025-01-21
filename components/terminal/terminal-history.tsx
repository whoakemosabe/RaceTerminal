'use client'

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { APP_VERSION, LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';

interface TerminalHistoryProps {
  history: Array<{ command: string; output: string; username: string }>;
}

export function TerminalHistory({ history }: TerminalHistoryProps) {
  const [mounted, setMounted] = useState(false);
  const [sessionStart] = useState(new Date().toLocaleString());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="font-mono text-sm h-[350px] overflow-y-auto mt-4">
      <div className="flex flex-col space-y-2">
        {[...history].reverse().map((entry, index) => {
          const timestamp = mounted ? new Date().toLocaleTimeString() : '';
          return (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2 terminal-prompt">
              {mounted && (
                <span className="terminal-timestamp">
                  [{timestamp}] {entry.username}@terminal
                </span>
              )}
              <code className="text-primary">{entry.command}</code>
            </div>
            <div
              className={cn(
                "pl-4 whitespace-pre-wrap break-words typing-effect",
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
      <div className="mt-6 text-xs text-muted-foreground/60 bg-card/50 backdrop-blur-lg p-3 border-t border-border/10 sticky bottom-0">
          <div className="terminal-system-info">
            {mounted && `System: RaceTerminal v${APP_VERSION} | Session started at ${sessionStart}`}
          </div>
      </div>
    </div>
  );
}