'use client'

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { APP_VERSION, LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface TerminalHistoryProps {
  history: Array<{
    command: string;
    output: string;
    username: string;
    timestamp: string;
  }>;
}

export function TerminalHistory({ history }: TerminalHistoryProps) {
  const [mounted, setMounted] = useState(false);
  const [sessionStart] = useState(new Date().toLocaleString());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="mt-4 h-[350px] font-mono overflow-y-auto transition-all duration-200">
      <div className="flex flex-col space-y-2">
        {[...history].reverse().map((entry, index) => {
          return (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              {mounted && (
                <span className="text-secondary font-mono">[{entry.timestamp}] {entry.username}:~$ </span>
              )}
              <code className="text-primary">{entry.command}</code>
            </div>
            <div
              className={cn(
                "pl-4 whitespace-pre-wrap break-words",
                entry.output.startsWith('❌') || entry.output.startsWith('Error:') || entry.output.includes('not found') || entry.output.includes('No ') 
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
      <div className="bottom-0 sticky bg-card/50 backdrop-blur-lg mt-6 p-3 border-t border-border/10 text-muted-foreground/60 text-xs">
          <div className="terminal-system-info">
            {mounted && `System: RaceTerminal v${APP_VERSION} | Session started at ${sessionStart}`}
          </div>
      </div>
    </div>
  );
}