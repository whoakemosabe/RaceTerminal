'use client'

import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TerminalInputProps {
  command: string;
  isProcessing: boolean;
  onCommandChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onExecute: () => void;
}

export function TerminalInput({
  command,
  isProcessing,
  onCommandChange,
  onFocus,
  onBlur,
  onKeyDown,
  onExecute
}: TerminalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();

    // Initialize and update time
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("mb-4", "terminal-input", "p-4")}>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="text-primary" />
          {currentTime && (
            <span className="text-xs text-muted-foreground/80 font-mono">
              {currentTime}
            </span>
          )}
        </div>
        <Input
          ref={inputRef}
          type="text"
          value={command}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => onCommandChange(e.target.value)}
          onKeyDown={onKeyDown}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onExecute();
            }
          }}
          placeholder="Enter command (e.g., /driver hamilton)"
          className="flex-1 bg-transparent border-none text-primary placeholder-primary/50 focus:outline-none text-sm font-mono cursor-blink h-8 px-2"
        />
        <Button
          onClick={onExecute}
          size="sm"
          className="h-8 px-4 execute-button"
          disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Execute'}
        </Button>
      </div>
    </div>
  );
}