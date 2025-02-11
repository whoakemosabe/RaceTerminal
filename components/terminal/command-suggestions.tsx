'use client'

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';
import { SuggestionManager } from '@/lib/suggestions/manager';
import { commands } from '@/lib/commands';
import { commandAliases } from '@/components/terminal/command-processor';

interface CommandSuggestionsProps {
  command: string;
  onSelect: (command: string) => void;
  isVisible: boolean;
  isNavigatingSuggestions: boolean;
  onNavigationStateChange: (isNavigating: boolean) => void;
  onClose: () => void;
  onShowSuggestionsChange: (show: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function CommandSuggestions({ 
  command, 
  onSelect, 
  isVisible, 
  isNavigatingSuggestions,
  onNavigationStateChange,
  onClose, 
  onShowSuggestionsChange,
  inputRef 
}: CommandSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<{value: string, description?: string, alias?: string, suffix?: string}[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [suggestionType, setSuggestionType] = useState<'command' | 'argument'>('command');
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastCommandRef = useRef<string>('');
  const suggestionManager = useRef(new SuggestionManager());
  const isFirstRenderRef = useRef(true);
  const [hasSetUsername, setHasSetUsername] = useState(false);

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
    // Extract the actual value without description and code/nationality
    let value = suggestion.includes('(') ? suggestion.split(' (')[0].trim() : suggestion.trim();
    let shouldShowSuggestions = false;
    
    // Split command into parts
    const parts = command.split(' ');
    const firstPart = parts[0];
    
    // If it's a base command (no spaces in input), add a space after
    if (parts.length === 1 && !command.includes(' ')) {
      onSelect(`${value} `);
      onClose();
      return;
    }

    // Check if this is a single-argument command
    const singleArgCommands = ['/list', '/ls'];
    if (singleArgCommands.includes(firstPart)) {
      onSelect(`${firstPart} ${value}`);
      onClose();
      return;
    }
    
    // For team suggestions, only take the team name part
    if (suggestionType === 'argument' && 
        (command.startsWith('/team') || 
         command.startsWith('/tm') || 
         command.startsWith('/compare team') || 
         command.startsWith('/m team') ||
         command.startsWith('/mt'))) {
      // Extract just the team name without any extra info
      value = value.split('(')[0].split(',')[0].trim();
      // Handle special cases for team names
      if (value.includes('Red Bull')) value = 'redbull';
      else if (value.includes('Mercedes')) value = 'mercedes';
      else if (value.includes('Ferrari')) value = 'ferrari';
      else if (value.includes('McLaren')) value = 'mclaren';
      else if (value.includes('Aston Martin')) value = 'aston_martin';
      else if (value.includes('Alpine')) value = 'alpine';
      else if (value.includes('Williams')) value = 'williams';
      else if (value.includes('AlphaTauri')) value = 'alphatauri';
      else if (value.includes('Alfa Romeo')) value = 'alfa';
      else if (value.includes('Haas')) value = 'haas';
    }

    // For driver suggestions, only take the name part before any parentheses or commas
    if (suggestionType === 'argument' && 
        (command.startsWith('/driver') || 
         command.startsWith('/d') || 
         command.startsWith('/compare driver') || 
         command.startsWith('/m driver') ||
         command.startsWith('/md'))) {
      value = value.split('(')[0].split(',')[0].trim();
    }

    // Handle /md and /mt shortcuts
    if (parts[0] === '/md' || parts[0] === '/mt') {
      // Remove the "(First Driver/Team)" or "(Second Driver/Team)" suffix
      value = value.split(' (')[0];
      onSelect(`${parts[0]} ${value} `);
      shouldShowSuggestions = true;
      onClose();
      return;
    }
    
    // Special handling for compare commands
    if (['/compare', '/m'].includes(parts[0])) {
      if (parts.length === 1) {
        onSelect(`${parts[0]} ${value} `);
        shouldShowSuggestions = true;
      } else {
        const prefix = parts.slice(0, -1).join(' ').trimEnd();
        if (parts[1] === 'driver' || parts[1] === 'team') {
          shouldShowSuggestions = true;
        }
        onSelect(`${prefix} ${value} `);
      }
      onClose();
    } else {
      // Standard handling for other commands
      if (parts.length > 1) {
        const prefix = parts.slice(0, -1).join(' ').trimEnd();
        onSelect(`${prefix} ${value} `);
      } else {
        onSelect(`${value} `);
      }
      onClose();
    }

    // Keep focus on input but don't add space
    const input = inputRef.current;
    if (input) {
      input.focus();
      // Set cursor position to end of input
      requestAnimationFrame(() => {
        if (shouldShowSuggestions) {
          onShowSuggestionsChange(true);
        }
        const length = input.value.length;
        input.setSelectionRange(length, length);
      });
    }
  };

  // Use SuggestionManager to get suggestions
  useEffect(() => {
    if (!command.startsWith('/')) {
      setSuggestions([]);
      setSelectedIndex(0);
      return;
    }

    const input = command.toLowerCase();
    const parts = input.split(' ');
    const firstPart = parts[0];

    // Don't show suggestions for /user command after the space
    if (firstPart === '/user' || firstPart === '/u') {
      if (parts.length > 1) {
        setSuggestions([]);
        setSelectedIndex(0);
        return;
      }
    }

    // If no username is set, only show /user command
    if (!hasSetUsername) {
      const userCommands = ['/user', '/u'];
      const matches = userCommands
        .filter(c => c.startsWith(firstPart))
        .map(c => ({ value: c }));
      setSuggestions(matches);
      return;
    }

    // Get suggestions from manager
    const matches = suggestionManager.current.getSuggestions(command);
    setSuggestionType(parts.length === 1 ? 'command' : 'argument');

    // Ensure unique suggestions and sort them
    setSuggestions(matches.sort((a, b) => a.value.localeCompare(b.value)));
    setSelectedIndex(0);
  }, [hasSetUsername, command]);

  // Rest of the code remains the same...

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
  }, [selectedIndex, isVisible, suggestions.length, isNavigatingSuggestions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return;

      switch (e.key) {
        case 'Enter':
          if (suggestions[selectedIndex]) {
            e.preventDefault();
            handleSelect(suggestions[selectedIndex].value);
            onNavigationStateChange(false);
            onClose();
          }
          break;
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
            handleSelect(suggestions[selectedIndex].value);
            onNavigationStateChange(false);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          onNavigationStateChange(false);
          inputRef.current?.focus();
          break;
      }
      
      // Always stop propagation for handled keys
      e.stopPropagation();
    };

    // Attach to the input element instead of window
    const input = inputRef.current;
    if (input) {
      input.addEventListener('keydown', handleKeyDown);
      return () => input.removeEventListener('keydown', handleKeyDown);
    }
  }, [
    suggestions,
    selectedIndex,
    isVisible,
    onSelect,
    handleSelect,
    isNavigatingSuggestions,
    onNavigationStateChange,
    onClose,
    inputRef
  ]);

  if (!isVisible || suggestions.length === 0) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="top-full right-0 left-0 z-[60] absolute mt-2 overflow-hidden"
      >
        <div className="relative bg-card/30 shadow-lg backdrop-blur-xl border border-border/20 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-card/40 px-3 py-2 border-b border-border/10">
            <div className="text-muted-foreground text-xs">
              {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} available
              <span className="ml-2 text-primary/50">
                (Use ↑↓ to navigate, Enter to select)
              </span>
            </div>
          </div>

          {/* Suggestions List */}
          <div 
            ref={containerRef} 
            className="relative space-y-1 p-2 max-h-[300px] overflow-y-auto"
            style={{ scrollbarGutter: 'stable' }}
          >
            {suggestions.map((suggestion, index) => {
              const isAlias = suggestion.alias;
              const cmd = commands.find(c => 
                c.command.split(' ')[0] === (isAlias ? commandAliases[suggestion.value] : suggestion.value)
              );
              const isSelected = index === selectedIndex;
              
              return (
                <motion.div
                  key={`${suggestion.value}-${index}`}
                  ref={el => itemRefs.current[index] = el}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm cursor-pointer transition-all duration-150",
                    "hover:bg-card/50 relative group",
                    isSelected ? "bg-card/60 shadow-inner" : "hover:shadow-inner"
                  )}
                  onClick={() => handleSelect(suggestion.value)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1, delay: index * 0.02 }}
                >
                  <div className="relative flex items-center gap-2">
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
                      {suggestion.value}
                      {suggestion.description && (
                        <span className="ml-2 text-muted-foreground/70 text-xs tracking-wide">
                          {suggestion.description}
                        </span>
                      )}
                      {isAlias && (
                        <span className="ml-2 text-secondary/70 text-xs tracking-wide">
                          → {suggestion.alias}
                        </span>
                      )}
                      {suggestion.suffix && (
                        <span className="ml-2 text-accent/70 text-xs tracking-wide">
                          {suggestion.suffix}
                        </span>
                      )}
                    </span>
                  </div>
                  {cmd && suggestionType === 'command' && (
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
          <div className="bg-card/40 px-3 py-2 border-t border-border/10">
            <div className="text-muted-foreground/60 text-xs">
              Press Tab to complete • Esc to close
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}