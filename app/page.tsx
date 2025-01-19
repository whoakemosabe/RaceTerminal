'use client'

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api/client';
import { commands } from '@/lib/commands';
import { processCommand } from '@/components/terminal/command-processor';
import { TerminalInput } from '@/components/terminal/terminal-input';
import { TerminalHistory } from '@/components/terminal/terminal-history';
import { SessionInfo } from '@/components/terminal/session-info';
import { HelpPanel } from '@/components/terminal/help-panel';
import { SchemaOrg } from '@/components/schema-org';

const MAX_HISTORY_SIZE = 100; // Maximum number of commands to store

export default function Home() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<Array<{ command: string; output: string }>>([]);
  const [raceData, setRaceData] = useState<any>(null);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandBuffer, setCommandBuffer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  // Load current race data for schema
  useEffect(() => {
    const loadRaceData = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const races = await api.getRaceSchedule(currentYear);
        if (races && races.length > 0) {
          // Find the next race or the last race of the season
          const now = new Date();
          const nextRace = races.find((race: { date: string | number | Date; }) => new Date(race.date) > now) || races[races.length - 1];
          setRaceData({
            ...nextRace,
            Circuit: {
              circuitName: nextRace.Circuit.circuitName,
              Location: {
                country: nextRace.Circuit.Location.country
              }
            }
          });
        }
      } catch (error) {
        console.error('Failed to load race data for schema:', error);
      }
    };
    loadRaceData();
  }, []);

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
        const availableCommands = commands.map(c => c.command.split(' ')[0]);
        
        if (input.startsWith('/')) {
          const matches = availableCommands.filter(c => c.startsWith(input));
          if (matches.length === 1) {
            setCommand(matches[0] + ' ');
          } else if (matches.length > 1) {
            const newEntry = { 
              command: command, 
              output: `Available commands:\n${matches.join('\n')}`
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

  const handleCommand = async () => {
    if (!command.trim()) return;
    const cmd = command.trim();
    if (isProcessing) return;

    setIsProcessing(true);
    setHistoryIndex(-1);
    setCommandBuffer('');

    try {
      const newEntry = { command: cmd, output: 'Processing command...' };
      setHistory(prev => [...prev, newEntry]);
      setCommand('');
      const output = await processCommand(cmd);
      setHistory(prev => 
        prev.map((entry, idx) => 
          idx === prev.length - 1 ? { command: entry.command, output } : entry
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Command execution error:', errorMessage);
      setHistory(prev => 
        prev.map((entry, idx) => 
          idx === prev.length - 1 
            ? { command: entry.command, output: 'Error: Command failed to execute. Please try again.' }
            : entry
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen p-8 relative overflow-hidden">
      <SchemaOrg raceData={raceData} />
      <div className="gradient-bg" />
      <div className="grid-lines" />
      <div className="max-w-7xl mx-auto page-content">
        <header className="text-center mb-12">
          <h1 className="text-7xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-secondary via-primary to-secondary animate-pulse">
            RaceTerminal Pro
          </h1>
          <p className="text-xl text-gray-400 tracking-wide">
            Your futuristic motorsports data companion
          </p>
        </header>

        <SessionInfo />

        <TerminalInput
          command={command}
          isProcessing={isProcessing}
          onCommandChange={(value) => {
            setCommand(value);
            if (historyIndex !== -1) {
              setHistoryIndex(-1);
            }
          }}
          onFocus={() => {}}
          onBlur={() => {}}
          onKeyDown={handleKeyDown}
          onExecute={handleCommand}
        />

        <TerminalHistory history={history} />

        <HelpPanel />

        {history.length === 0 && (
          <div className="text-center text-gray-400 animate-pulse tracking-widest">
            <p>Waiting for your command...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick access cards will be added here */}
        </div>
      </div>
    </main>
  );
}