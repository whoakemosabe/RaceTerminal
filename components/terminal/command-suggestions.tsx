'use client'

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
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
  const exitAnimationRef = useRef<NodeJS.Timeout>();
  const suggestionManager = useRef<SuggestionManager | null>(null);
  const isFirstRenderRef = useRef(true);
  const [hasSetUsername, setHasSetUsername] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Lazy initialize suggestion manager
  useEffect(() => {
    if (!suggestionManager.current) {
      suggestionManager.current = new SuggestionManager();
    }
  }, []);

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
    setIsExiting(true);
    exitAnimationRef.current = setTimeout(() => {
      setIsExiting(false);
      onClose();
    }, 100);

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
      setIsExiting(false); // Keep suggestions open
      onShowSuggestionsChange(true);
    } else { 
      onSelect(newCommand.trim()); // Complete the command
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
          setIsExiting(true);
          exitAnimationRef.current = setTimeout(() => {
            setIsExiting(false);
            onClose();
          }, 100);
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
    const matches = suggestionManager.current?.getSuggestions(command) || [];
    setSuggestionType(stage === 0 ? 'command' : 'argument');

    // Show all suggestions for new stage, otherwise filter by current input
    const filteredMatches = isNewStage ? 
      matches : 
      matches.filter(s => {
        const lowerValue = s.value.toLowerCase();
        const lowerPart = currentPart.toLowerCase();
        return lowerValue.startsWith(lowerPart);
      });

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (exitAnimationRef.current) {
        clearTimeout(exitAnimationRef.current);
      }
    };
  }, []);

  if ((!isVisible && !isExiting) || suggestions.length === 0) return null;

  const dropdownVariants: Variants = {
    initial: { 
      opacity: 0,
      y: 10,
      transition: { duration: 0.1 }
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.1 }
    },
    exit: { 
      opacity: 0,
      y: -4,
      transition: { duration: 0.1, ease: [0.3, 0, 0.2, 1] }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={dropdownVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="top-full right-0 left-0 z-[60] absolute mt-2 overflow-hidden"
        key="suggestions-dropdown"
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
                    "px-3 py-2 rounded-md text-sm cursor-pointer transition-all duration-100",
                    "hover:bg-card/50 relative group",
                    isSelected ? "bg-card/60 shadow-inner" : "hover:shadow-inner"
                  )}
                  onClick={() => handleSelect(suggestion.value)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ 
                    duration: 0.1,
                    delay: index * 0.015,
                    ease: [0.2, 0, 0, 1]
                  }}
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
                      {isAlias && (
                        <span className="ml-2 text-secondary/70 text-xs tracking-wide">
                          → {suggestion.alias}
                        </span>
                      )}
                      {suggestion.suffix && (
                        <span className={cn(
                          "ml-2 px-2 py-0.5 rounded-md text-xs font-mono",
                          "bg-card/40 border border-border/20 backdrop-blur-sm",
                          isSelected ? "text-primary border-primary/20" : "text-muted-foreground"
                        )}>
                          {suggestion.suffix}
                        </span>
                      )}
                      {suggestion.metadata && (
                        <span className="ml-2 text-secondary/70 text-xs tracking-wide">
                          ({suggestion.metadata})
                        </span>
                      )}
                    </span>
                  </div>
                  {cmd && suggestionType === 'command' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ 
                        duration: 0.1,
                        ease: [0.2, 0, 0.2, 1]
                      }}
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