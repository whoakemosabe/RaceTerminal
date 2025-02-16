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
    let value = suggestion.trim();
    const parts = command.split(/\s+/).filter(Boolean);
    const baseCommand = parts[0].toLowerCase();
    const stage = parts.length - (command.endsWith(' ') ? 0 : 1);

    // For team commands, use the team ID if available
    if (baseCommand === '/team' && stage === 1) {
      const teamSuggestion = suggestions.find(s => s.value === value);
      if (teamSuggestion && 'id' in teamSuggestion) {
        value = teamSuggestion.id as string;
      }
    }

    // Clean up value (remove aliases)
    value = value.split('(')[0].trim();

    // Build new command with proper spacing
    let newCommand = stage === 0 ? value : `${parts.slice(0, stage).join(' ')} ${value}`;

    // Determine if command needs more arguments
    const needsMoreArgs = (
      // Compare command needs type + 2 items
      (baseCommand === '/compare' || baseCommand === '/m') && stage < 3 ||
      // Compare shortcuts need 2 items
      (baseCommand === '/md' || baseCommand === '/mt') && stage < 2 ||
      // Single argument commands on first stage
      stage === 0 ||
      // Commands that always need arguments
      ['/driver', '/d', '/track', '/t', '/team', '/theme'].includes(baseCommand)
    );

    if (needsMoreArgs) {
      // Ensure exactly one space at the end
      onSelect(newCommand.trimEnd() + ' ');
      onShowSuggestionsChange(true); // Keep suggestions open
    } else { 
      onSelect(newCommand.trim()); // Complete the command
      onClose(); // Close suggestions
    }
  };

  // Handle key events on the input element
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return;

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          e.stopPropagation();
          if (suggestions[selectedIndex]) {
            handleSelect(suggestions[selectedIndex].value);
            onNavigationStateChange(false);
            onClose();
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          e.stopPropagation();
          if (!isNavigatingSuggestions) {
            onNavigationStateChange(true);
            return;
          }
          const nextIndex = (selectedIndex + 1) % suggestions.length;
          setSelectedIndex(nextIndex);
          break;
        case 'ArrowUp':
          e.preventDefault();
          e.stopPropagation();
          if (!isNavigatingSuggestions) {
            onNavigationStateChange(true);
            return;
          }
          const prevIndex = (selectedIndex - 1 + suggestions.length) % suggestions.length;
          setSelectedIndex(prevIndex);
          break;
        case 'Tab':
          e.preventDefault();
          e.stopPropagation();
          if (suggestions[selectedIndex]) {
            handleSelect(suggestions[selectedIndex].value);
            onNavigationStateChange(false);
          }
          break;
        case 'Escape':
          e.preventDefault();
          e.stopPropagation();
          onClose();
          onNavigationStateChange(false);
          inputRef.current?.focus();
          break;
      }
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
    handleSelect,
    isNavigatingSuggestions,
    onNavigationStateChange,
    onClose,
    inputRef
  ]);

  // Use SuggestionManager to get suggestions
  useEffect(() => {
    // Clear suggestions if not a command or empty
    if (!command || !command.startsWith('/')) {
      clearSuggestions();
      return;
    }

    // Split command and handle spaces
    const parts = command.toLowerCase().split(/\s+/);
    const isNewStage = command.endsWith(' ');
    const stage = isNewStage ? parts.length : parts.length - 1;
    const currentPart = isNewStage ? '' : parts[parts.length - 1];

    // Special handling for /user command
    const isUserCommand = parts[0] === '/user' || parts[0] === '/u';
    const isUserCommandWithArg = isUserCommand && stage > 0;

    // Username validation
    if (!hasSetUsername && !isUserCommand) {
      const userCommands = ['/user', '/u'];
      const matches = userCommands
        .filter(c => c.startsWith(parts[0] || ''))
        .map(c => ({ value: c }));
      setSuggestions(matches);
      if (matches.length > 0) {
        setSelectedIndex(0);
        onShowSuggestionsChange(true);
      }
      return;
    }

    // Don't show suggestions for /user command with argument
    if (isUserCommandWithArg) {
      clearSuggestions();
      return;
    }

    // Get suggestions from manager
    const matches = suggestionManager.current.getSuggestions(command);
    setSuggestionType(stage === 0 ? 'command' : 'argument');

    // Show all suggestions for new stage, otherwise filter by current input
    const filteredMatches = isNewStage ? 
      matches : 
      matches.filter(s => s.value.toLowerCase().startsWith(currentPart.toLowerCase()));

    setSuggestions(filteredMatches);
    setSelectedIndex(0);
    onShowSuggestionsChange(filteredMatches.length > 0);
  }, [command, hasSetUsername, onShowSuggestionsChange]);

  const clearSuggestions = () => {
    setSuggestions([]);
    setSelectedIndex(0);
    onShowSuggestionsChange(false);
  };

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