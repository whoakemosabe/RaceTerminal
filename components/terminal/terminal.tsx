'use client'

import { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, Info, Clock, Calendar, Cpu, RotateCw, HelpCircle } from 'lucide-react';
import { APP_VERSION, LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';
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
  showWelcome?: boolean;
  onCloseWelcome?: () => void;
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
  onExecute,
  showWelcome,
  onCloseWelcome
}: TerminalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [sessionStart, setSessionStart] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleTimeString());
  const [hasSetUsername, setHasSetUsername] = useState(false);

  // Scroll to top when new command is added
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = 0;
    }
  }, [history.length]);

  useEffect(() => {
    setMounted(true);
    
    // Focus input on mount
    inputRef.current?.focus();

    // Set initial session start time
    setSessionStart(new Date().toLocaleString());
    
    // Load saved font size
    const savedSize = parseInt(localStorage.getItem('terminal_font_size') || '14');
    setFontSize(savedSize);
    
    // Set up username state
    const savedUsername = localStorage.getItem(LOCALSTORAGE_USERNAME_KEY);
    setHasSetUsername(!!savedUsername && savedUsername !== DEFAULT_USERNAME);

    // Listen for username changes
    const handleUsernameChange = (e: CustomEvent) => {
      const newUsername = e.detail;
      setHasSetUsername(!!newUsername && newUsername !== DEFAULT_USERNAME);
    };

    window.addEventListener('usernameChange', handleUsernameChange as EventListener);
    return () => window.removeEventListener('usernameChange', handleUsernameChange as EventListener);


    const handleFontSizeChange = (e: CustomEvent) => {
      setFontSize(e.detail);
    };

    window.addEventListener('fontSizeChange', handleFontSizeChange as EventListener);
    
    return () => {
      window.removeEventListener('fontSizeChange', handleFontSizeChange as EventListener);
    };
  }, []);

  // Separate effect for time updates
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    
    // Update immediately
    setCurrentTime(new Date().toLocaleTimeString());

    
    // Set up interval for updates
    const interval = setInterval(updateTime, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleReset = () => {
    localStorage.removeItem('commandHistory');
    localStorage.removeItem('terminal_theme');
    localStorage.removeItem(LOCALSTORAGE_USERNAME_KEY);
    window.location.reload();
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden terminal-window">
      {/* Top Status Bar */}
      <div className="top-0 z-10 sticky flex items-center bg-card/60 px-3 py-1 border-b border-border/10 h-8">
        <div className="grid grid-cols-3 w-full">
          
          <div className="flex justify-start gap-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">v{APP_VERSION}</span>
            </div>
          </div>

          <div className="flex justify-center items-center gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">
                {mounted ? new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : 'Loading...'}
              </span>
            </div>

          </div>

          <div className="flex justify-end items-center gap-2">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono text-xs text-muted-foreground">
                {mounted ? currentTime : 'Loading...'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Command Input */}
      <div className="px-4 py-1.5 border-b border-border/10 terminal-input-wrapper">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-primary" />
          <div className="relative flex flex-1 gap-2" onClick={() => onCloseWelcome?.()}>
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
                  onCloseWelcome?.();
                  onShowSuggestionsChange(false);
                  onNavigationStateChange(false);
                }
              }}
              placeholder={hasSetUsername ? "Enter command (e.g., /driver hamilton)" : "Please enter a username to unlock more commands (e.g., /user max)"}
              className="flex-1 h-7 font-mono text-sm cursor-blink placeholder-primary/50 terminal-input"
            />
            <Button
              onClick={onExecute}
              size="sm"
              onMouseDown={() => onCloseWelcome?.()}
              className="px-3 h-6 text-sm execute-button"
              disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Execute'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Command History */}
      {(!hasSetUsername || showWelcome) ? (
        <div className="flex flex-col flex-1">
          <div className="flex flex-col flex-1 justify-center items-center -mt-8 px-4">
            <div className="space-y-6 p-8 w-full max-w-2xl text-center glass-panel relative">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-primary">Welcome to RaceTerminal Pro</h3>
                <p className="text-lg text-muted-foreground">Your advanced Formula 1 data companion</p>
              </div>
              {!hasSetUsername && (
                <div className="space-y-6">
                  <div className="p-6 glass-panel border border-primary/20">
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-primary">Set Your Username to Begin</h4>
                      <div className="flex flex-col items-center gap-3">
                        <code className="bg-card/50 px-4 py-2 rounded-md text-primary font-mono">/user your_name</code>
                        <p className="text-sm text-muted-foreground">
                          Example: <code className="text-primary/80">/user max</code>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {hasSetUsername && showWelcome && (
                <div className="space-y-6">
                  <div className="flex justify-center items-center gap-2 text-secondary">
                    <HelpCircle className="w-5 h-5" />
                    <p className="text-sm">Type <code className="bg-card/50 px-2 py-0.5 rounded">/help</code> to see all available commands</p>
                  </div>
                  
                  <div className="p-4 glass-panel border border-primary/20">
                    <div className="space-y-3">
                      <h4 className="text-lg font-medium text-primary">Welcome aboard, {localStorage.getItem(LOCALSTORAGE_USERNAME_KEY)}!</h4>
                      <p className="text-sm text-muted-foreground">
                        You're all set to explore Formula 1 data. Here are some commands to get you started:
                      </p>
                    </div>
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
                        <li>/track monza</li>
                        <li>/live</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCloseWelcome}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Start Using Terminal
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : history.length > 0 && (
        <div className="relative flex-1 font-mono text-sm overflow-y-auto terminal-history"
            ref={historyRef} 
            style={{ 
              scrollBehavior: 'smooth', 
              fontSize: `${fontSize}px`,
              '--terminal-font-size': `${fontSize}px`
            } as React.CSSProperties}>
          <div className="scanlines-layer absolute inset-0 pointer-events-none" />
          <div className="flex flex-col space-y-2">
            {[...history].reverse().map((entry, index) => {
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2 terminal-prompt" style={{ fontSize: `${fontSize}px` }}>
                    {mounted && (
                      <span className="terminal-timestamp" style={{ fontSize: `${fontSize}px` }}>
                        [{entry.timestamp || 'unknown'}] {entry.username}@terminal
                      </span>
                    )}
                    <code className="text-primary" style={{ fontSize: `${fontSize}px` }}>{entry.command}</code>
                  </div>
                  <div
                    className={cn(
                      "pl-4 whitespace-pre-wrap break-words",
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
      
      {/* Bottom Status Bar */}
      <div className="relative flex items-center px-3 py-1 border-t border-border/10 select-none terminal-status-bar">

      <div className="grid grid-cols-3 w-full">
          {/* Left Section - Version */}
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

          {/* Middle Section - Session Info */}
          <div className="flex justify-center items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  className="h-6 w-6 hover:text-secondary transition-colors duration-200"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="tooltip-content">
                <p>Reset Terminal</p>
              </TooltipContent>
            </Tooltip>
            <div className="flex flex-col items-center text-xs text-muted-foreground/50">
              <div>
                Powered by <a href="http://ergast.com/mrd/" target="_blank" rel="noopener noreferrer" className="text-primary/50 hover:text-primary/80 transition-colors">Ergast</a> & <a href="https://openf1.org" target="_blank" rel="noopener noreferrer" className="text-secondary/50 hover:text-secondary/80 transition-colors">OpenF1</a>
              </div>
              {mounted && hasSetUsername && <div className="text-[10px] opacity-70">
                Session started at {sessionStart}
              </div>}
            </div>
          </div>

          {/* Right Section - Status */}
          <div className="flex justify-end items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help status-active">
                  <Cpu className="w-3.5 h-3.5" />
                  <span className="font-mono text-xs">{hasSetUsername ? 'Active' : 'Waiting for username'}</span>
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