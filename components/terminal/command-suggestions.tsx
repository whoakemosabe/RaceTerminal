'use client'

import { useEffect, useState, useRef } from 'react';
import { commands } from '@/lib/commands';
import { commandAliases } from '@/components/terminal/command-processor';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CommandSuggestionsProps {
  command: string;
  onSelect: (command: string) => void;
  isVisible: boolean;
  isNavigatingSuggestions: boolean;
  onNavigationStateChange: (isNavigating: boolean) => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function CommandSuggestions({ 
  command, 
  onSelect, 
  isVisible, 
  isNavigatingSuggestions,
  onNavigationStateChange,
  onClose, 
  inputRef 
}: CommandSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Reset refs array when suggestions change
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, suggestions.length);
  }, [suggestions]);

  // Check if the input exactly matches a command or alias
  const isExactMatch = (input: string): boolean => {
    const availableCommands = commands.map(c => c.command.split(' ')[0]);
    const allCommands = [...new Set([
      ...availableCommands,
      ...Object.keys(commandAliases)
    ])];
    return allCommands.some(cmd => cmd.toLowerCase() === input.toLowerCase());
  };

  // Focus input after selection
  const handleSelect = (suggestion: string) => {
    onSelect(suggestion);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (!command.startsWith('/')) {
      setSuggestions([]);
      return;
    }

    const input = command.toLowerCase();
    const parts = input.split(' ');
    const firstPart = parts[0];

    // Don't show suggestions if there's an exact match
    if (isExactMatch(firstPart)) {
      setSuggestions([]);
      return;
    }

    // Get all available commands and aliases
    const availableCommands = commands.map(c => c.command.split(' ')[0]);
    const allCommands = [...new Set([
      ...availableCommands,
      ...Object.keys(commandAliases)
    ])];

    // Filter commands that match the input
    const matches = allCommands
      .filter(c => c.startsWith(firstPart))
      .sort((a, b) => a.localeCompare(b));

    setSuggestions(matches);
    setSelectedIndex(0);
  }, [command]);

  // Scroll selected item into view
  useEffect(() => {
    if (isVisible && suggestions.length > 0) {
      const selectedElement = itemRefs.current[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex, isVisible, suggestions.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          onNavigationStateChange(true);
          setSelectedIndex(prev => (prev + 1) % suggestions.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          onNavigationStateChange(true);
          setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            handleSelect(suggestions[selectedIndex]);
            onNavigationStateChange(false);
          }
          break;
        case 'Tab':
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            handleSelect(suggestions[selectedIndex]);
            onNavigationStateChange(false);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          onNavigationStateChange(false);
          inputRef.current?.focus();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [suggestions, selectedIndex, isVisible, onSelect]);

  if (!isVisible || suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="absolute left-0 right-0 top-full mt-1 z-[60] backdrop-blur-md"
      >
        <div className="bg-card/30 border border-border/20 rounded-md overflow-hidden">
          <div 
            ref={containerRef} 
            className="p-1 space-y-0.5 max-h-[200px] overflow-y-auto"
            style={{ scrollbarGutter: 'stable' }}
          >
            {suggestions.map((suggestion, index) => {
              const isAlias = commandAliases[suggestion];
              const cmd = commands.find(c => 
                c.command.split(' ')[0] === (isAlias ? commandAliases[suggestion] : suggestion)
              );
              
              return (
                <div
                  key={suggestion}
                  ref={el => itemRefs.current[index] = el}
                  className={cn(
                    "px-2 py-1 rounded text-sm cursor-pointer transition-colors duration-150",
                    "hover:bg-primary/10",
                    index === selectedIndex && "bg-primary/20"
                  )}
                  onClick={() => handleSelect(suggestion)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-primary">
                      {suggestion}
                      {isAlias && (
                        <span className="text-secondary/60 ml-2 text-xs">
                          → {commandAliases[suggestion]}
                        </span>
                      )}
                    </span>
                    {cmd && (
                      <span className="text-xs text-muted-foreground/60 truncate ml-4">
                        {cmd.description}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}