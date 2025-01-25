'use client'

import { useState, useEffect, useCallback } from 'react';
import { LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useUsername } from '@/hooks/use-username';
import { api } from '@/lib/api/client';
import { Terminal } from '@/components/terminal/terminal';
import { SessionInfo } from '@/components/terminal/session-info';
import { HelpPanel } from '@/components/terminal/help-panel';
import { commands } from '@/lib/commands';
import { commandAliases } from '@/components/terminal/command-processor';
import { driverNicknames, teamNicknames, trackNicknames } from '@/lib/utils';
import { processCommand } from '@/components/terminal/command-processor';

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
  const [commandBuffer, setCommandBuffer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isNavigatingSuggestions, setIsNavigatingSuggestions] = useState(false);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const { username } = useUsername();

  const clearHistory = useCallback(() => {
    localStorage.removeItem('commandHistory');
    setHistory([]);
    setHistoryIndex(-1);
    setCommandBuffer('');
  }, []);

  // Memoize command processor to prevent recreation
  const handleCommand = useCallback(async () => {
    if (!command.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setHistoryIndex(-1);
    setCommandBuffer('');

    const timestamp = new Date().toLocaleTimeString();
    const cmd = command.trim();

    try {
      const newEntry = { 
        command: cmd, 
        output: 'Processing command...', 
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
            ? { ...entry, output: 'Error: Command failed to execute. Please try again.' }
            : entry
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, [command, isProcessing, username]);

  // Load history from localStorage on mount
  useEffect(() => {
    if (!isHistoryLoaded) {
      try { 
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
  }, [isHistoryLoaded]);
  
  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (isHistoryLoaded && history.length > 0) {
      try {
        // Only keep the most recent MAX_HISTORY_SIZE commands
        const historyToSave = history.slice(-MAX_HISTORY_SIZE);
        localStorage.setItem('commandHistory', JSON.stringify(historyToSave));
      } catch (error) {
        console.error('Failed to save history:', error);
      }
    }
  }, [history, isHistoryLoaded]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (!isNavigatingSuggestions && history.length > 0) {
          if (historyIndex === -1) {
            setCommandBuffer(command);
          }
          const newIndex = historyIndex + 1;
          if (newIndex < history.length) {
            setHistoryIndex(newIndex);
            setCommand(history[history.length - 1 - newIndex].command);
            setShowSuggestions(false);
          }
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isNavigatingSuggestions && historyIndex > -1) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setCommand(newIndex === -1 ? commandBuffer : history[history.length - 1 - newIndex].command);
          setShowSuggestions(false);
        }
        break;

      case 'Tab':
        e.preventDefault();
        const input = command.toLowerCase();
        setShowSuggestions(true);
        const suggestions: string[] = [];
        
        // Split command into parts
        const parts = input.split(' ');
        const firstPart = parts[0];
        const lastPart = parts[parts.length - 1];

        if (firstPart.startsWith('/')) {
          // Command completion
          if (parts.length === 1) {
            // Complete base command
            const availableCommands = commands.map(c => c.command.split(' ')[0]);
            const allCommands = [...new Set([
              ...availableCommands,
              ...Object.keys(commandAliases)
            ])];
            
            suggestions.push(...allCommands.filter(c => c.startsWith(firstPart)));
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
          } else if (suggestions.length > 1) {
            // Multiple matches - show suggestions
            const newEntry = {
              command: command,
              output: `Available options:\n${suggestions.sort().map(s => `  ${s}`).join('\n')}`,
              username,
              timestamp: new Date().toLocaleTimeString()
            };
            setHistory(prev => [...prev, newEntry]);
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
              command: command, 
              output: 'Command cancelled by user'
            };
            setHistory(prev => [...prev, newEntry]);
            setCommand('');
          }
        }
        break;
    }
  };


  return (
    <main className="h-screen relative overflow-hidden flex flex-col">
      <div className="fixed inset-0 z-[-1]">
        <div className="gradient-bg" />
        <div className="grid-lines" />
      </div>
      <div className="max-w-7xl w-full mx-auto px-8 pt-2 pb-1 flex-shrink-0">
        <header className="text-center mb-2 glass-panel py-2 px-4 border-b border-border/20">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-secondary via-primary to-secondary animate-pulse">
            RaceTerminal Pro
          </h1>
          <p className="text-xs text-muted-foreground/80 tracking-wide mt-1">
            Your futuristic motorsports data companion
          </p>
        </header>
      </div>

      <div className="w-full max-w-7xl mx-auto px-8 flex-1 flex flex-col overflow-hidden">
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
        />

        <HelpPanel />
      </div>
    </main>
  );
}