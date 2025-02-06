'use client'

import { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, Info, Clock, Calendar, Cpu, RotateCw, HelpCircle } from 'lucide-react';
import { APP_VERSION } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { CommandSuggestions } from './command-suggestions';

interface TerminalProps {
  command: string;
  isProcessing: boolean;
  history: Array<{ command: string; output: string; username: string; timestamp?: string }>;
  showSuggestions: boolean;
  onShowSuggestionsChange: (show: boolean) => void;
  isNavigatingSuggestions: boolean;
  onNavigationStateChange: (isNavigating: boolean) => void;
  onCommandChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onExecute: () => void;
  onReset?: () => void;
}

export function Terminal({
  command,
  isProcessing,
  history,
  showSuggestions,
  onShowSuggestionsChange,
  isNavigatingSuggestions,
  onNavigationStateChange,
  onCommandChange,
  onKeyDown,
  onExecute
}: TerminalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [sessionStart] = useState(new Date().toLocaleString());

  // Scroll to top when new command is added
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = 0;
    }
  }, [history.length]);

  useEffect(() => {
    setMounted(true);
    
    // Initial focus only on mount
    inputRef.current?.focus();

    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleReset = () => {
    localStorage.removeItem('commandHistory');
    window.location.reload();
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden terminal-window">
      {/* Top Status Bar */}
      <div className="top-0 z-10 sticky flex items-center bg-card/60 px-3 py-1 border-b border-border/10 h-8 terminal-status-bar">
        <div className="grid grid-cols-3 w-full">
          
          <div className="flex justify-start gap-2 text-primary">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">v{APP_VERSION}</span>
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">
                {new Date(sessionStart).toLocaleDateString()}
              </span>
            </div>

          </div>

          <div className="flex justify-end items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">{currentTime}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Command Input */}
      <div className="px-4 py-1.5 border-b border-border/10 terminal-input-wrapper">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-primary" />
          <div className="relative flex flex-1 gap-2">
            <CommandSuggestions
              command={command}
              isVisible={showSuggestions && command.startsWith('/')}
              onClose={() => onShowSuggestionsChange(false)}
              onNavigationStateChange={onNavigationStateChange}
              isNavigatingSuggestions={isNavigatingSuggestions}
              inputRef={inputRef}
              onSelect={(suggestion) => {
                onCommandChange(suggestion + ' ');
                onShowSuggestionsChange(false);
                onNavigationStateChange(false);
                // Focus the input after selection
                inputRef.current?.focus();
              }}
            />
            <Input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => {
                onCommandChange(e.target.value);
                onShowSuggestionsChange(true);
                onNavigationStateChange(false);
              }}
              onFocus={() => onShowSuggestionsChange(true)}
              onBlur={() => setTimeout(() => onShowSuggestionsChange(false), 200)}
              onKeyDown={(e) => {
                if (!isNavigatingSuggestions) {
                  onKeyDown(e);
                }
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onExecute();
                  onShowSuggestionsChange(false);
                  onNavigationStateChange(false);
                }
              }}
              placeholder="Enter command (e.g., /driver hamilton)"
              className="flex-1 h-7 font-mono text-sm cursor-blink focus:outline-none placeholder-primary/50 terminal-input"
            />
            <Button
              onClick={onExecute}
              size="sm"
              className="px-3 h-6 text-sm execute-button"
              disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Execute'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Command History */}
      {history.length > 0 && (
        <div className="relative flex-1 font-mono text-sm overflow-y-auto terminal-history"
            ref={historyRef}
            style={{ scrollBehavior: 'smooth' }}>
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
                      entry.output === 'Processing command' && "processing-dots",
                      entry.output.startsWith('❌') || entry.output.startsWith('Error:') || entry.output.includes('not found') || entry.output.includes('No ') 
                        ? 'text-red-500' 
                        : 'text-white'
                    )}
                    style={{ 
                      lineHeight: '1.5',
                      overflowWrap: 'break-word',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
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
        <div className="flex flex-col flex-1">
          <div className="flex flex-col flex-1 justify-center items-center -mt-8 px-4">
            <div className="space-y-6 p-8 w-full max-w-2xl text-center glass-panel">
              <div className="flex justify-center items-center gap-3 font-semibold text-2xl text-primary">
                <Info className="w-8 h-8" />
                <h2>Welcome to RaceTerminal Pro</h2>
              </div>
              
              <p className="text-lg text-muted-foreground">
                Your advanced Formula 1 data companion
              </p>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-center items-center gap-2 text-secondary">
                  <HelpCircle className="w-5 h-5" />
                  <p>Type <code className="bg-card/50 px-2 py-0.5 rounded">/help</code> to see all available commands</p>
                </div>
                
                <div className="gap-4 grid grid-cols-2 mx-auto max-w-lg text-muted-foreground/80">
                  <div className="p-3 glass-panel">
                    <p className="mb-1 font-medium text-primary">Quick Start</p>
                    <ul className="space-y-1 text-xs">
                      <li>/driver hamilton</li>
                      <li>/standings</li>
                      <li>/next</li>
                    </ul>
                  </div>
                  <div className="p-3 glass-panel">
                    <p className="mb-1 font-medium text-primary">Popular Commands</p>
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
      <div className="z-10 sticky flex items-center bg-card/40 backdrop-blur-md px-3 py-1 border-t border-border/10 select-none">

      <div className="grid grid-cols-3 w-full">
         {/* Left Section */}
          <div className="flex justify-start items-center gap-2 text-muted-foreground">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <TerminalIcon className="w-3.5 h-3.5" />
            <span className="font-mono text-xs">
              RaceTerminal Pro v{APP_VERSION}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="start" className="tooltip-content">
          <p>System Version</p>
        </TooltipContent>
      </Tooltip>
    </div>

    {/* Middle Section */}
    <div className="flex justify-center items-center gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleReset}
            className="flex items-center hover:text-secondary transition-colors duration-200"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="tooltip-content">
          <p>Reset Terminal Session</p>
        </TooltipContent>
      </Tooltip>
    </div>

    {/* Right Section */}
    <div className="flex justify-end items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help status-active">
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-mono text-xs">Active</span>
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