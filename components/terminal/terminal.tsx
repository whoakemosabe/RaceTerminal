'use client'

import { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { APP_VERSION } from '@/lib/constants';

interface TerminalProps {
  command: string;
  isProcessing: boolean;
  history: Array<{ command: string; output: string; username: string }>;
  onCommandChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onExecute: () => void;
}

export function Terminal({
  command,
  isProcessing,
  history,
  onCommandChange,
  onKeyDown,
  onExecute
}: TerminalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [sessionStart] = useState(new Date().toLocaleString());

  useEffect(() => {
    setMounted(true);
    inputRef.current?.focus();

    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-input p-2 flex-1 flex flex-col overflow-hidden">
      <div className="terminal-system-info terminal-input-wrapper sticky top-0 z-10">
        <div className="flex items-center gap-2 w-full">
          <div className="flex items-center gap-2">
            <TerminalIcon className="text-primary h-4 w-4" />
            {currentTime && (
              <span className="text-xs text-muted-foreground/80 font-mono">
                {currentTime}
              </span>
            )}
          </div>
          <div className="flex-1 flex items-center justify-between gap-2 relative z-1">
            <Input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => onCommandChange(e.target.value)}
              onKeyDown={onKeyDown}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onExecute();
                }
              }}
              placeholder="Enter command (e.g., /driver hamilton)"
              className="flex-1 bg-card/30 backdrop-blur-md border border-border/20 text-primary placeholder-primary/50 focus:outline-none text-xs font-mono cursor-blink h-6 rounded-sm"
            />
            <Button
              onClick={onExecute}
              size="sm"
              className="h-6 px-3 execute-button text-xs"
              disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Execute'}
            </Button>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="font-mono text-sm flex-1 overflow-y-auto relative terminal-history">
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
              );
            })}
          </div>
          <div className="terminal-system-info sticky bottom-0 left-0 right-0 w-full">
            {mounted && `System: RaceTerminal v${APP_VERSION} | Session started at ${sessionStart}`}
          </div>
        </div>
      )}
      {history.length === 0 && (
        <div className="flex-1 flex flex-col">
          <div className="text-center text-muted-foreground/60 mt-8">
            <p className="mb-2">Welcome to RaceTerminal Pro</p>
            <p className="text-sm">Type <code className="text-primary">/help</code> to see available commands</p>
          </div>
          <div className="mt-auto terminal-system-info">
            {mounted && `System: RaceTerminal v${APP_VERSION} | Session started at ${sessionStart}`}
          </div>
        </div>
      )}
    </div>
  );
}