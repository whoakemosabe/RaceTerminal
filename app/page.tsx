'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import { LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { FullscreenTerminal } from '@/components/terminal/fullscreen-terminal';
import { useUsername } from '@/hooks/use-username';
import { api } from '@/lib/api/client';
import { Terminal } from '@/components/terminal/terminal';
import { SessionInfo } from '@/components/terminal/session-info';
import { HelpPanel } from '@/components/terminal/help-panel';
import { commands } from '@/lib/commands';
import { commandAliases } from '@/components/terminal/command-processor';
import { driverNicknames, teamNicknames, trackNicknames } from '@/lib/utils';
import { processCommand } from '@/components/terminal/command-processor';
import { teamThemes } from '@/lib/utils';

const MAX_HISTORY_SIZE = 100; // Maximum number of commands to store

interface HistoryEntry {
  command: string;
  output: string;
  username: string;
  timestamp: string;
}

export default function Home() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isNavigatingSuggestions, setIsNavigatingSuggestions] = useState(false);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMainVisible, setIsMainVisible] = useState(true);
  const resizeRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [hasSetUsername, setHasSetUsername] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const isResizingRef = useRef(false);
  const initialHeightRef = useRef(700);
  const { username } = useUsername();
  
  // Set session start time on mount
  useEffect(() => {
    if (!localStorage.getItem('session_start_time')) {
      localStorage.setItem('session_start_time', Date.now().toString());
    }
  }, []);

  // Check if username has been set
  useEffect(() => {
    const savedUsername = localStorage.getItem(LOCALSTORAGE_USERNAME_KEY);
    const isValidUsername = !!savedUsername && savedUsername !== DEFAULT_USERNAME;
    setHasSetUsername(isValidUsername);
    
    // Show welcome message if username is valid
    if (isValidUsername) {
      setShowWelcome(true);
    }

    // Listen for welcome message event
    const handleShowWelcome = () => {
      setShowWelcome(true);
    };

    // Listen for username changes
    const handleUsernameChange = (e: CustomEvent) => {
      const newUsername = e.detail;
      const isValid = !!newUsername && newUsername !== DEFAULT_USERNAME;
      setHasSetUsername(isValid);
      if (isValid) {
        setShowWelcome(true);
      }
    };

    window.addEventListener('showWelcome', handleShowWelcome);
    window.addEventListener('usernameChange', handleUsernameChange as EventListener);
    
    return () => {
      window.removeEventListener('showWelcome', handleShowWelcome);
      window.removeEventListener('usernameChange', handleUsernameChange as EventListener);
    };
  }, [username]);

  // Handle resize functionality
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (resizeRef.current?.contains(e.target as Node)) {
        isResizingRef.current = true;
        document.body.classList.add('resizing');
      }
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.body.classList.remove('resizing');
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;

      const container = terminalRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newHeight = e.clientY - containerRect.top;
      
      // Set minimum and maximum heights
      const minHeight = 200;
      const maxHeight = window.innerHeight - 200; // Leave space for help panel
      
      const height = Math.min(Math.max(newHeight, minHeight), maxHeight);
      container.style.height = `${height}px`;
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Add global keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'Enter') {
        e.preventDefault();
        if (!isFullscreen) {
          setIsMainVisible(false);
          setTimeout(() => setIsFullscreen(true), 300);
        } else {
          setIsFullscreen(false);
          setTimeout(() => setIsMainVisible(true), 100);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem('commandHistory');
    setHistory([]);
    setHistoryIndex(-1);
    setCommand('');
  }, []);

  // Memoize command processor to prevent recreation
  const handleCommand = useCallback(async () => {
    if (!command.trim() || isProcessing) return;
    
    // Close welcome panel when executing any command
    setShowWelcome(false);
    
    // Only allow /user or /u commands if username hasn't been set
    const isUserCommand = command.toLowerCase().startsWith('/user') || command.toLowerCase().startsWith('/u');
    if (!hasSetUsername && !isUserCommand) {
      const newEntry = {
        command: command.trim(),
        output: '❌ Please set your username first using the /user command (e.g., /user max)',
        username: DEFAULT_USERNAME,
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory(prev => [...prev, newEntry]);
      setCommand('');
      return;
    }

    // Show welcome message after setting username
    if (command.toLowerCase().startsWith('/user') && !command.toLowerCase().includes('reset')) {
      setShowWelcome(true);
    }

    // Special handling for reset command
    if (command.trim().toLowerCase() === '/rs' || command.trim().toLowerCase() === '/reset') {
      localStorage.removeItem('commandHistory');
      localStorage.removeItem('terminal_theme');
      localStorage.removeItem(LOCALSTORAGE_USERNAME_KEY);
      window.location.replace(window.location.href);
      return;
    }
    
    const timestamp = new Date().toLocaleTimeString();
    const cmd = command.trim();
    
    setIsProcessing(true);
    setHistoryIndex(-1);
    
    try {
      const newEntry = { 
        command: cmd, 
        output: 'Processing command', 
        username,
        timestamp
      };
      setHistory(prev => [...prev, newEntry]);
      setCommand('');
      const output = await processCommand(cmd);
      setHistory(prev => 
        prev.map((entry, idx) => 
          idx === prev.length - 1 ? { ...entry, output, timestamp } : entry
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Command execution error:', errorMessage);
      setHistory(prev => 
        prev.map((entry, idx) => 
          idx === prev.length - 1 
            ? { ...entry, output: errorMessage }
            : entry
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, [command, isProcessing, username, hasSetUsername]);

  // Load history from localStorage on mount
  useEffect(() => {
    if (!isHistoryLoaded) {
      try { 
        // Load saved effects
        const matrixEnabled = localStorage.getItem('matrix_enabled') === 'true';
        const scanlinesEnabled = localStorage.getItem('scanlines_enabled') === 'true';
        
        if (matrixEnabled) document.documentElement.classList.add('matrix-enabled');
        if (scanlinesEnabled) document.documentElement.classList.add('scanlines-enabled');
        document.documentElement.classList.add('retro-text-disabled');
        
        // Load saved theme
        const savedTheme = localStorage.getItem('terminal_theme');
        if (savedTheme && teamThemes[savedTheme]) {
          const theme = teamThemes[savedTheme];
          document.documentElement.style.setProperty('--primary', theme.primary);
          document.documentElement.style.setProperty('--secondary', theme.secondary);
          document.documentElement.style.setProperty('--accent', theme.accent);
          document.documentElement.style.setProperty('--border', theme.border);
        }

        const savedHistory = localStorage.getItem('commandHistory');
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          if (Array.isArray(parsedHistory)) {
            setHistory(parsedHistory.slice(-MAX_HISTORY_SIZE));
          }
        }
      } catch (error) {
        console.error('Failed to load history:', error);
        // Reset history if loading fails
        localStorage.removeItem('commandHistory');
        setHistory([]);
      }
      setIsHistoryLoaded(true);
    }

    // Listen for clear terminal event
    const handleClearTerminal = () => {
      clearHistory();
    };

    window.addEventListener('clearTerminal', handleClearTerminal);
    return () => window.removeEventListener('clearTerminal', handleClearTerminal);
  }, [isHistoryLoaded, clearHistory]);
  
  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (isHistoryLoaded && history.length > 0) {
      try {
        // Only keep the most recent MAX_HISTORY_SIZE commands
        if (hasSetUsername) {
          const historyToSave = history.slice(-MAX_HISTORY_SIZE);
          localStorage.setItem('commandHistory', JSON.stringify(historyToSave));
        }
      } catch (error) {
        console.error('Failed to save history:', error);
      }
    }
  }, [history, isHistoryLoaded, hasSetUsername]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (isNavigatingSuggestions) {
          // Handle suggestion navigation
          onNavigationStateChange(true);
        } else if (history.length > 0) {
          // Handle command history navigation
          const nextIndex = Math.min(historyIndex + 1, history.length - 1);
          setHistoryIndex(nextIndex);
          setCommand(history[history.length - 1 - nextIndex].command);
          setShowSuggestions(false);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (isNavigatingSuggestions) {
          // Handle suggestion navigation
          onNavigationStateChange(true);
        } else if (historyIndex > -1) {
          // Handle command history navigation
          const nextIndex = historyIndex - 1;
          setHistoryIndex(nextIndex);
          if (nextIndex === -1) {
            setCommand('');
          } else {
            setCommand(history[history.length - 1 - nextIndex].command);
          }
          setShowSuggestions(false);
        }
        break;

      case 'Tab':
        if (isNavigatingSuggestions) return;
        e.preventDefault();
        const input = command.toLowerCase();
        const suggestions: string[] = [];
        
        // Split command into parts
        const parts = input.split(' ');
        const firstPart = parts[0];
        const lastPart = parts[parts.length - 1];

        if (firstPart.startsWith('/')) {
          // Command completion
          if (parts.length === 1) {
            // Complete base command
            const commandSet = new Set<string>();
            // Add base commands
            commands.forEach(c => commandSet.add(c.command.split(' ')[0]));
            // Add aliases
            Object.keys(commandAliases).forEach(alias => commandSet.add(alias));
            
            suggestions.push(...Array.from(commandSet).filter(c => c.startsWith(firstPart)));
          } else {
            // Argument completion based on command
            const baseCommand = commandAliases[firstPart] || firstPart;
            
            switch (baseCommand) {
              case '/driver':
              case '/d':
                // Driver name completion
                const driverNames = Object.values(driverNicknames).flat();
                suggestions.push(...driverNames.filter(name => 
                  name.toLowerCase().startsWith(lastPart)
                ));
                break;
                
              case '/track':
              case '/t':
                // Track name completion
                const trackNames = Object.values(trackNicknames).flat();
                suggestions.push(...trackNames.filter(name => 
                  name.toLowerCase().startsWith(lastPart)
                ));
                break;
                
              case '/team':
                // Team name completion
                const teamNames = Object.values(teamNicknames).flat();
                suggestions.push(...teamNames.filter(name => 
                  name.toLowerCase().startsWith(lastPart)
                ));
                break;
                
              case '/compare':
              case '/m':
                if (parts.length === 2) {
                  // Type completion
                  suggestions.push(...['driver', 'team'].filter(t => 
                    t.startsWith(lastPart)
                  ));
                } else if (parts[1] === 'driver') {
                  // Driver name completion for comparison
                  const driverNames = Object.values(driverNicknames).flat();
                  suggestions.push(...driverNames.filter(name => 
                    name.toLowerCase().startsWith(lastPart)
                  ));
                } else if (parts[1] === 'team') {
                  // Team name completion for comparison
                  const teamNames = Object.values(teamNicknames).flat();
                  suggestions.push(...teamNames.filter(name => 
                    name.toLowerCase().startsWith(lastPart)
                  ));
                }
                break;
            }
          }
          
          if (suggestions.length === 1) {
            // Single match - complete the command
            const completed = parts.slice(0, -1).join(' ') + 
              (parts.length > 1 ? ' ' : '') + 
              suggestions[0];
            setCommand(completed + ' ');
            setShowSuggestions(false);
          } else if (suggestions.length > 1) {
            // Show suggestions dropdown
            setShowSuggestions(true);
          }
        }
        break;

      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        break;

      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          clearHistory();
        }
        break;

      case 'c':
        if (e.ctrlKey) {
          e.preventDefault();
          if (isProcessing) {
            setIsProcessing(false);
            const newEntry = { 
              username,
              timestamp: new Date().toLocaleTimeString(),
              command: command, 
              output: 'Command cancelled by user'
            } as HistoryEntry;
            setHistory(prev => [...prev, newEntry]);
            setCommand('');
          }
        }
        break;
    }
  };


  return (
    <main className="relative flex flex-col h-screen overflow-hidden">
      <div className="z-[-1] fixed inset-0">
        <div className="gradient-bg" />
        <div className="grid-lines" />
      </div>
      <div className="flex-shrink-0 mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-1 w-full max-w-7xl">
        <header className="mb-2 px-4 py-2 border-b border-border/20 text-center glass-panel">
          <h1 className="bg-clip-text bg-gradient-to-r from-secondary via-primary to-secondary font-bold text-2xl sm:text-3xl lg:text-4xl text-transparent tracking-tight animate-pulse">
            RaceTerminal Pro
          </h1>
          <p className="mt-1 text-muted-foreground/80 text-[10px] sm:text-xs tracking-wide">
            Your futuristic motorsports data companion
          </p>
        </header>
      </div>

      <div className="flex flex-col mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl h-[calc(100vh-100px)] terminal-container">
        <FullscreenTerminal
          isOpen={isFullscreen}
          onClose={() => {
            setIsFullscreen(false);
            setTimeout(() => setIsMainVisible(true), 100);
          }}
          command={command}
          isProcessing={isProcessing}
          history={history}
          showSuggestions={showSuggestions}
          onShowSuggestionsChange={setShowSuggestions}
          isNavigatingSuggestions={isNavigatingSuggestions}
          onNavigationStateChange={setIsNavigatingSuggestions}
          onCommandChange={(value) => {
            setCommand(value);
            if (historyIndex !== -1) {
              setHistoryIndex(-1);
            }
          }}
          onKeyDown={handleKeyDown}
          onExecute={handleCommand} 
          showWelcome={showWelcome}
          onCloseWelcome={() => setShowWelcome(false)}
        />

        <div 
          ref={terminalRef}
          style={{ height: initialHeightRef.current }}
          className={cn( 
            "transition-all duration-300 ease-in-out min-h-[200px]",
            isMainVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
          <Terminal
            command={command}
            isProcessing={isProcessing}
            history={history}
            showSuggestions={showSuggestions}
            onShowSuggestionsChange={setShowSuggestions}
            isNavigatingSuggestions={isNavigatingSuggestions}
            onNavigationStateChange={setIsNavigatingSuggestions}
            onCommandChange={(value) => {
              setCommand(value);
              if (historyIndex !== -1) {
                setHistoryIndex(-1);
              }
            }}
            onKeyDown={handleKeyDown}
            onExecute={handleCommand}
            showWelcome={showWelcome}
            onCloseWelcome={() => setShowWelcome(false)}
          />
        </div>

        <div
          ref={resizeRef}
          className="my-2 bg-border/10 hover:bg-border/20 rounded-full h-1 transition-colors cursor-row-resize flex-shrink-0"
        />
        <div className="overflow-y-auto flex-1">
          <HelpPanel />
        </div>
      </div>
    </main>
  );
}