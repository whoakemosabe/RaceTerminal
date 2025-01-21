'use client'

import { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, Info, Clock, Calendar, Cpu, RotateCw, HelpCircle } from 'lucide-react';
import { APP_VERSION } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TerminalProps {
  command: string;
  isProcessing: boolean;
  history: Array<{ command: string; output: string; username: string; timestamp?: string }>;
  onCommandChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onExecute: () => void;
  onReset?: () => void;
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

  const handleReset = () => {
    localStorage.removeItem('commandHistory');
    window.location.reload();
  };

  return (
    <div className="terminal-window flex-1 flex flex-col overflow-hidden">
      {/* Top Status Bar */}
      <div className="terminal-status-bar sticky top-0 z-10 h-8 border-b border-border/10">
        <div className="grid grid-cols-4 w-full">
          <div className="flex items-center gap-4 text-primary justify-start">
            <div className="flex items-center gap-2 cursor-help">
              <Info className="h-3.5 w-3.5" />
              <span className="text-xs font-mono">v{APP_VERSION}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs font-mono">
                    {new Date(sessionStart).toLocaleDateString()}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="tooltip-content">
                <p>Session Start Date</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs font-mono">{currentTime}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="tooltip-content">
                <p>Current Time</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <Cpu className="h-3.5 w-3.5" />
                  <span className="text-xs font-mono">Session Active</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end" className="tooltip-content">
                <p>Terminal Status</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Command Input */}
      <div className="terminal-input-wrapper px-4 py-1.5 border-b border-border/10">
        <div className="flex items-center gap-2">
          <TerminalIcon className="text-primary h-4 w-4" />
          <div className="flex-1 flex gap-2">
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
              className="flex-1 bg-card/20 border-border/10 text-primary placeholder-primary/50 focus:outline-none text-xs font-mono cursor-blink h-7"
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
      
      {/* Command History */}
      {history.length > 0 && (
        <div className="font-mono text-sm flex-1 overflow-y-auto relative terminal-history">
          <div className="flex flex-col space-y-2">
            {[...history].reverse().map((entry, index) => {
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2 terminal-prompt">
                    {mounted && (
                      <span className="terminal-timestamp">
                        [{entry.timestamp || 'unknown'}] {entry.username}@terminal
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
              )
            })}
          </div>
        </div>
      )}
      {history.length === 0 && (
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col items-center justify-center flex-1 px-4 -mt-8">
            <div className="glass-panel p-8 max-w-2xl w-full text-center space-y-6">
              <div className="flex items-center justify-center gap-3 text-2xl font-semibold text-primary">
                <Info className="h-8 w-8" />
                <h2>Welcome to RaceTerminal Pro</h2>
              </div>
              
              <p className="text-muted-foreground text-lg">
                Your advanced Formula 1 data companion
              </p>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-center gap-2 text-secondary">
                  <HelpCircle className="h-5 w-5" />
                  <p>Type <code className="bg-card/50 px-2 py-0.5 rounded">/help</code> to see all available commands</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto text-muted-foreground/80">
                  <div className="glass-panel p-3">
                    <p className="font-medium text-primary mb-1">Quick Start</p>
                    <ul className="space-y-1 text-xs">
                      <li>/driver hamilton</li>
                      <li>/standings</li>
                      <li>/next</li>
                    </ul>
                  </div>
                  <div className="glass-panel p-3">
                    <p className="font-medium text-primary mb-1">Popular Commands</p>
                    <ul className="space-y-1 text-xs">
                      <li>/schedule</li>
                      <li>/track monza (Temple of Speed)</li>
                      <li>/live</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Status Bar */}
      <div className="terminal-status-bar sticky bottom-0 z-10">
        <div className="grid grid-cols-4 w-full">
          <div className="col-span-2 flex items-center gap-2 text-muted-foreground justify-start">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <TerminalIcon className="h-3.5 w-3.5" />
                  <span className="text-xs font-mono">
                    RaceTerminal Pro v{APP_VERSION}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" align="start" className="tooltip-content">
                <p>System Version</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex items-center gap-4 justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleReset}
                  className="flex items-center hover:text-secondary transition-colors duration-200"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="tooltip-content">
                <p>Reset Terminal Session</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex items-center gap-2 justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help status-active">
                  <Cpu className="h-3.5 w-3.5" />
                  <span className="text-xs font-mono">Active</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" align="end" className="tooltip-content">
                <p>Terminal Status</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}