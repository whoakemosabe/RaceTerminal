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
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const { username } = useUsername();

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
        if (history.length > 0) {
          if (historyIndex === -1) {
            setCommandBuffer(command);
          }
          const newIndex = historyIndex + 1;
          if (newIndex < history.length) {
            setHistoryIndex(newIndex);
            setCommand(history[history.length - 1 - newIndex].command);
          }
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (historyIndex > -1) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setCommand(newIndex === -1 ? commandBuffer : history[history.length - 1 - newIndex].command);
        }
        break;

      case 'Tab':
        e.preventDefault();
        const input = command.toLowerCase();
        
        if (input.startsWith('/')) {
          // Get all command names (first word of each command)
          const availableCommands = commands.map(c => c.command.split(' ')[0]);
          
          // Add common aliases
          const commandAliases = {
            '/t': '/track',
            '/r': '/race',
            '/q': '/qualifying',
            '/s': '/standings',
            '/c': '/constructors',
            '/w': '/weather',
            '/l': '/live',
            '/n': '/next',
            '/h': '/help'
          };
          
          // Combine unique commands and aliases
          const allCommands = [...new Set([
            ...availableCommands,
            ...Object.keys(commandAliases)
          ])];
          
          // Find matches that start with the input
          const matches = allCommands.filter(c => c.startsWith(input));
          
          if (matches.length === 1) {
            // If it's an alias, use the full command
            const fullCommand = commandAliases[matches[0]] || matches[0];
            setCommand(fullCommand + ' ');
          } else if (matches.length > 1) {
            // Show available matches
            const newEntry = {
              command: command,
              output: `Available commands:\n${matches.sort().map(m => 
                `  ${m}${commandAliases[m] ? ` → ${commandAliases[m]}` : ''}`
              ).join('\n')}`,
              username
            };
            setHistory(prev => [...prev, newEntry]);
          }
        }
        break;

      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          localStorage.removeItem('commandHistory');
          setHistory([]);
          setHistoryIndex(-1);
          setCommandBuffer('');
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