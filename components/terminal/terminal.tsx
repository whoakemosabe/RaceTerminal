'use client'

import { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, Info, Clock, Calendar, Cpu, RotateCw, HelpCircle } from 'lucide-react';
import { APP_VERSION, LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';
import { teamThemes } from '@/lib/utils';
import { colorThemes } from '@/lib/themes/colors';
import { calculatorThemes } from '@/lib/themes/calculator';
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
  inputRef?: React.RefObject<HTMLInputElement>;
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
  onCloseWelcome,
  inputRef: externalInputRef
}: TerminalProps) {
  const localInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef || localInputRef;
  const historyRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [sessionStart, setSessionStart] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString());
  const [hasSetUsername, setHasSetUsername] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');

  // Scroll to top when new command is added
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = 0;
    }
  }, [history.length]);

  useEffect(() => {
    setMounted(true);
    
    // Load initial font size and set it
    const savedSize = parseInt(localStorage.getItem('terminal_font_size') || '14', 10);
    setFontSize(savedSize);
    document.documentElement.style.setProperty('--terminal-font-size', `${savedSize}px`);

    // Clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Focus input on mount
    inputRef.current?.focus();

    // Set initial session start time
    setSessionStart(new Date().toLocaleString());

    // Set up username state
    const savedUsername = localStorage.getItem(LOCALSTORAGE_USERNAME_KEY);
    setHasSetUsername(!!savedUsername && savedUsername !== DEFAULT_USERNAME);

    // Load saved theme
    if (!themeLoaded) {
      const savedTheme = localStorage.getItem('terminal_theme');
      setCurrentTheme(savedTheme?.replace(/_/g, ' ') || 'default');
      
      // Remove calculator mode class by default
      document.documentElement.classList.remove('calculator-enabled');
      localStorage.removeItem('calculator_color_scheme');
      
      if (savedTheme) {
        // Apply team theme
        const teamTheme = teamThemes[savedTheme];
        if (teamTheme) {
          // Reset to default background colors first
          document.documentElement.style.setProperty('--background', '0 0% 0%');
          document.documentElement.style.setProperty('--card', '0 0% 2%');
          document.documentElement.style.setProperty('--popover', '0 0% 2%');
          document.documentElement.style.setProperty('--history-bg', '0 0% 2%');
          
          // Set theme colors
          document.documentElement.style.setProperty('--primary', teamTheme.primary);
          document.documentElement.style.setProperty('--secondary', teamTheme.secondary);
          document.documentElement.style.setProperty('--primary-foreground', '210 40% 98%');
          document.documentElement.style.setProperty('--secondary-foreground', '210 40% 98%');
          document.documentElement.style.setProperty('--accent-foreground', '210 40% 98%');
          document.documentElement.style.setProperty('--accent', teamTheme.accent);
          document.documentElement.style.setProperty('--border', teamTheme.border);
          document.documentElement.style.setProperty('--foreground', '210 40% 98%');
          document.documentElement.style.setProperty('--card-foreground', '210 40% 98%');
          document.documentElement.style.setProperty('--popover-foreground', '210 40% 98%');
          document.documentElement.style.setProperty('--muted', '217.2 32.6% 17.5%');
          document.documentElement.style.setProperty('--muted-foreground', '215 20.2% 65.1%');

          // Update other history colors
          document.documentElement.style.setProperty('--history-fg', '210 40% 98%');
          document.documentElement.style.setProperty('--history-primary', `hsl(${teamTheme.primary})`);
          document.documentElement.style.setProperty('--history-secondary', `hsl(${teamTheme.secondary})`);
          document.documentElement.style.setProperty('--history-accent', `hsl(${teamTheme.accent})`);
          document.documentElement.style.setProperty('--history-muted', 'hsl(217.2 32.6% 17.5%)');
          document.documentElement.style.setProperty('--history-border', `hsl(${teamTheme.border})`);
        } else {
          // Check for editor theme
          const colorTheme = colorThemes[savedTheme];
          if (colorTheme) {
            const [h, s, l] = colorTheme.background.split(' ');
            const darkerL = Math.max(0, parseInt(l) - 4);
            const evenDarkerL = Math.max(0, parseInt(l) - 6);
            
            document.documentElement.style.setProperty('--background', `${h} ${s} ${evenDarkerL}%`);
            document.documentElement.style.setProperty('--card', `${h} ${s} ${darkerL}%`);
            document.documentElement.style.setProperty('--popover', `${h} ${s} ${darkerL}%`);
            document.documentElement.style.setProperty('--history-bg', `${h} ${s} ${darkerL}%`);
            document.documentElement.style.setProperty('--foreground', colorTheme.foreground);
            document.documentElement.style.setProperty('--primary-foreground', colorTheme.foreground);
            document.documentElement.style.setProperty('--secondary-foreground', colorTheme.foreground);
            document.documentElement.style.setProperty('--accent-foreground', colorTheme.foreground);
            document.documentElement.style.setProperty('--card-foreground', colorTheme.foreground);
            document.documentElement.style.setProperty('--popover-foreground', colorTheme.foreground);
            document.documentElement.style.setProperty('--primary', colorTheme.primary);
            document.documentElement.style.setProperty('--secondary', colorTheme.secondary);
            document.documentElement.style.setProperty('--accent', colorTheme.accent);
            document.documentElement.style.setProperty('--muted', colorTheme.muted);
            document.documentElement.style.setProperty('--muted-foreground', colorTheme.foreground);
            document.documentElement.style.setProperty('--border', colorTheme.border);
            
            document.documentElement.style.setProperty('--history-fg', colorTheme.foreground);
            document.documentElement.style.setProperty('--history-primary', colorTheme.primary);
            document.documentElement.style.setProperty('--history-secondary', colorTheme.secondary);
            document.documentElement.style.setProperty('--history-accent', colorTheme.accent);
            document.documentElement.style.setProperty('--history-muted', colorTheme.muted);
            document.documentElement.style.setProperty('--history-border', colorTheme.border);
          }
        }
      }
      setThemeLoaded(true);
    }

    // Listen for username changes
    const handleUsernameChange = (e: CustomEvent) => {
      const newUsername = e.detail;
      setHasSetUsername(!!newUsername && newUsername !== DEFAULT_USERNAME);
    };

    window.addEventListener('usernameChange', handleUsernameChange as EventListener);
    return () => window.removeEventListener('usernameChange', handleUsernameChange as EventListener);

  }, [themeLoaded]);

  // Handle font size changes
  useEffect(() => {
    const handleFontSizeChange = (e: CustomEvent) => {
      const newSize = e.detail;
      if (typeof newSize === 'number' && !isNaN(newSize)) {
        // Update state
        setFontSize(newSize);
        // Update CSS variable
        document.documentElement.style.setProperty(
          '--terminal-font-size',
          `${newSize}px`
        );
      }
    };

    window.addEventListener('fontSizeChange', handleFontSizeChange as EventListener);
    
    return () => {
      window.removeEventListener('fontSizeChange', handleFontSizeChange as EventListener);
    };
  }, []);

  // Separate effect for time updates
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString());
    };
    
    // Update every second
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
            {mounted && <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="font-mono text-xs">v{APP_VERSION}</span>
            </div>}
          </div>

          <div className="flex justify-center items-center gap-2">
            {mounted && <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="font-mono text-xs">{
                new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>}
          </div>

          <div className="flex justify-end items-center gap-2">
            {mounted && <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="font-mono text-xs text-muted-foreground">{liveTime}</span>
            </div>}
          </div>

        </div>
      </div>

      {/* Command Input */}
      <div className="px-4 py-1.5 border-b border-border/10 terminal-input-wrapper">
        <div className="flex items-center gap-4">
          <TerminalIcon className="w-4 h-4 text-primary/80" aria-hidden="true" />
          <div className="relative flex flex-1 gap-2" onClick={() => onCloseWelcome?.()}>
            <CommandSuggestions
              command={command}
              isVisible={showSuggestions && command.startsWith('/')}
              onShowSuggestionsChange={onShowSuggestionsChange}
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
              className="h-8 font-mono text-sm cursor-blink placeholder-primary/50 terminal-input"
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => {
                onCommandChange(e.target.value);
                if (e.target.value.startsWith('/') && !e.target.value.endsWith(' ')) {
                  onShowSuggestionsChange(true);
                }
                onNavigationStateChange(false);
              }}
              onFocus={() => {
                if (command.startsWith('/') && !command.endsWith(' ')) {
                  onShowSuggestionsChange(true);
                }
              }}
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
            />
            <Button
              onClick={onExecute}
              size="sm"
              onMouseDown={() => onCloseWelcome?.()}
              className="px-4 h-8 text-sm execute-button"
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
                    <Info className="w-5 h-5" />
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
              fontSize: `${fontSize}px`
            } as React.CSSProperties}>
          <div className="scanlines-layer absolute inset-0 pointer-events-none" />
          <div className="flex flex-col space-y-2">
            {[...history].reverse().map((entry, index) => {
              const isError = entry.output && (
                typeof entry.output === 'string' && (
                  entry.output.startsWith('❌') || 
                  entry.output.startsWith('Error:') || 
                  entry.output.includes('not found') || 
                  entry.output.includes('No ')
                )
              );
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2 terminal-prompt" style={{ lineHeight: '1.5' }}>
                    {mounted && (
                      <span className="terminal-timestamp" style={{ lineHeight: '1.5' }}>
                        [{entry.timestamp || 'unknown'}] {entry.username}@terminal
                      </span>
                    )}
                    <code className="text-[hsl(217_100%_80%)]" style={{ lineHeight: '1.5' }}>{entry.command}</code>
                  </div>
                  <div
                    className={cn(
                      "pl-4 whitespace-pre-wrap break-words",
                      entry.output === 'Processing command' && "processing-dots",
                      isError && "text-[hsl(var(--error))]"
                    )}
                    style={{ 
                      lineHeight: '1.5',
                      overflowWrap: 'break-word',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      color: isError ? 'hsl(var(--error))' : 'hsl(0 0% 100%)'
                    }}
                    dangerouslySetInnerHTML={{ __html: entry.output || '' }}
                  />
                </div>
              );
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
                  className="h-6 w-6 hover:text-secondary/80 transition-colors hover:bg-transparent"
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
              {mounted && hasSetUsername && (
                <div className="flex items-center gap-1 text-[10px] opacity-70">
                  <Clock className="w-3 h-3" />
                  <span>Session started at {sessionStart}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Status */}
          <div className="flex justify-end items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help text-muted-foreground/70">
                  <div className="w-2 h-2 rounded-full bg-primary/50" />
                  <span className="font-mono text-[10px]">
                    {currentTheme}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" align="end" className="tooltip-content">
                <p>Current Theme</p>
              </TooltipContent>
            </Tooltip>
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