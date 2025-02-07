'use client'

import { useEffect, useState, useRef, useCallback } from 'react';
import { commands } from '@/lib/commands';
import { commandAliases } from '@/components/terminal/command-processor';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';

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
  const [hasSetUsername, setHasSetUsername] = useState(false);
  const lastCommandRef = useRef<string>('');
  const isFirstRenderRef = useRef(true);

  // Check if username has been set
  useEffect(() => {
    const savedUsername = localStorage.getItem(LOCALSTORAGE_USERNAME_KEY);
    setHasSetUsername(!!savedUsername && savedUsername !== DEFAULT_USERNAME);

    // Listen for username changes
    const handleUsernameChange = () => {
      const currentUsername = localStorage.getItem(LOCALSTORAGE_USERNAME_KEY);
      setHasSetUsername(!!currentUsername && currentUsername !== DEFAULT_USERNAME);
    };

    window.addEventListener('usernameChange', handleUsernameChange);
    return () => window.removeEventListener('usernameChange', handleUsernameChange);
  }, []);
  // Reset refs array when suggestions change
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, suggestions.length);
    if (isFirstRenderRef.current) {
      setSelectedIndex(0);
      isFirstRenderRef.current = false;
    }
    lastCommandRef.current = command;
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
    // Preserve any arguments after the command
    const parts = command.split(' ');
    const args = parts.slice(1).join(' ');
    const newCommand = suggestion + (args ? ' ' + args : '');
    onSelect(newCommand);

    // Keep focus on input but don't add space
    const input = inputRef.current;
    if (input) {
      input.focus();
      // Set cursor position to end of input
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }
  };

  useEffect(() => {
    if (!command.startsWith('/')) {
      setSuggestions([]);
      return;
    }

    const input = command.toLowerCase();
    const parts = input.split(' ');
    const firstPart = parts[0];

    // If no username is set, only show /user command
    if (!hasSetUsername) {
      const userCommands = ['/user', '/u'];
      const matches = userCommands.filter(c => c.startsWith(firstPart));
      setSuggestions(matches);
      setSelectedIndex(0);
      return;
    }

    // Don't show suggestions if there's an exact match
    if (isExactMatch(firstPart) && parts.length === 1) {
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
  }, [command, hasSetUsername]);

  // Scroll selected item into view
  useEffect(() => {
    if (isVisible && suggestions.length > 0) {
      const selectedElement = itemRefs.current[selectedIndex];
      if (selectedElement && isNavigatingSuggestions) {
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
      
      // Always allow Enter to execute the selected suggestion
      if (e.key === 'Enter' && suggestions[selectedIndex]) {
        e.preventDefault();
        handleSelect(suggestions[selectedIndex]);
        inputRef.current?.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
        onNavigationStateChange(false);
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isNavigatingSuggestions) {
            onNavigationStateChange(true);
            return;
          }
          const nextIndex = (selectedIndex + 1) % suggestions.length;
          setSelectedIndex(nextIndex);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!isNavigatingSuggestions) {
            onNavigationStateChange(true);
            return;
          }
          const prevIndex = (selectedIndex - 1 + suggestions.length) % suggestions.length;
          setSelectedIndex(prevIndex);
          break;
        case 'Tab':
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            // Preserve any arguments after the command
            const parts = command.split(' ');
            const args = parts.slice(1).join(' ');
            const newCommand = suggestions[selectedIndex] + (args ? ' ' + args : ' ');
            onSelect(newCommand);
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
  }, [suggestions, selectedIndex, isVisible, onSelect, command]);

  if (!isVisible || suggestions.length === 0) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="absolute left-0 right-0 top-full mt-2 z-[60] overflow-hidden"
      >
        <div className="bg-card/30 backdrop-blur-xl border border-border/20 rounded-lg overflow-hidden shadow-lg relative">
          {/* Header */}
          <div className="px-3 py-2 border-b border-border/10 bg-card/40">
            <div className="text-xs text-muted-foreground">
              {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} available
              <span className="ml-2 text-primary/50">
                (Use ↑↓ to navigate, Enter to select)
              </span>
            </div>
          </div>

          {/* Suggestions List */}
          <div 
            ref={containerRef} 
            className="p-2 space-y-1 max-h-[300px] overflow-y-auto relative"
            style={{ scrollbarGutter: 'stable' }}
          >
            {suggestions.map((suggestion, index) => {
              const isAlias = commandAliases[suggestion];
              const cmd = commands.find(c => 
                c.command.split(' ')[0] === (isAlias ? commandAliases[suggestion] : suggestion)
              );
              const isSelected = index === selectedIndex;
              
              return (
                <motion.div
                  key={suggestion}
                  ref={el => itemRefs.current[index] = el}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm cursor-pointer transition-all duration-150",
                    "hover:bg-card/50 relative group",
                    isSelected ? "bg-card/60 shadow-inner" : "hover:shadow-inner"
                  )}
                  onClick={() => handleSelect(suggestion)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1, delay: index * 0.02 }}
                >
                  <div className="flex items-center gap-2 relative">
                    <ChevronRight 
                      className={cn(
                        "w-4 h-4 transition-all duration-150 absolute -left-2",
                        isSelected ? "opacity-100 text-primary" : "opacity-0"
                      )}
                    />
                    <span className={cn(
                      "font-mono font-medium transition-colors duration-150 ml-2",
                      isSelected ? "text-primary" : "text-primary/80"
                    )}>
                      {suggestion}
                      {isAlias && (
                        <span className="text-secondary/70 ml-2 text-xs tracking-wide">
                          → {commandAliases[suggestion]}
                        </span>
                      )}
                    </span>
                  </div>
                  {cmd && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      className={cn(
                        "mt-1 text-xs font-light tracking-wide pl-6",
                        isSelected ? "text-muted-foreground" : "text-muted-foreground/50"
                      )}
                    >
                      {cmd.description}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-border/10 bg-card/40">
            <div className="text-xs text-muted-foreground/60">
              Press Tab to complete • Esc to close
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}