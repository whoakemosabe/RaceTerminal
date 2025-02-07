'use client'

import { useEffect, useState, useRef, useCallback } from 'react';
import { commands } from '@/lib/commands';
import { commandAliases } from '@/components/terminal/command-processor';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { driverNicknames, teamNicknames, trackNicknames } from '@/lib/utils';
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
  const [suggestionType, setSuggestionType] = useState<'command' | 'argument'>('command');
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastCommandRef = useRef<string>('');
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
    // Extract the actual value without description
    const value = suggestion.includes('(') ? suggestion.split(' (')[0] : suggestion;
    
    // Get the current command parts
    const currentParts = command.split(' ');
    
    // If we're completing an argument, preserve the command and previous args
    if (currentParts.length > 1) {
      const newParts = [...currentParts.slice(0, -1), value];
      onSelect(newParts.join(' ') + ' ');
    } else {
      // For base commands, just use the suggestion
      onSelect(value + ' ');
    }

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
    const lastPart = parts[parts.length - 1];

    // Helper function to deduplicate suggestions
    const deduplicate = (items: string[]): string[] => {
      return Array.from(new Set(items));
    };

    // If no username is set, only show /user command
    if (!hasSetUsername) {
      const userCommands = ['/user', '/u'];
      const matches = deduplicate(userCommands.filter(c => c.startsWith(firstPart)));
      setSuggestions(matches);
      return;
    }

    let matches: string[] = [];

    // Handle command completion
    if (parts.length === 1) {
      setSuggestionType('command');
      // Complete base command
      const commandSet = new Set<string>();
      // Add base commands
      commands.forEach(c => commandSet.add(c.command.split(' ')[0]));
      // Add aliases
      Object.keys(commandAliases).forEach(alias => commandSet.add(alias));
      
      matches = Array.from(commandSet).filter(c => c.startsWith(firstPart));
    } else {
      setSuggestionType('argument');
      // Handle argument completion based on command
      const baseCommand = commandAliases[firstPart] || firstPart;
      
      switch (baseCommand) {
        // Race Results Commands
        case '/race':
        case '/r':
          if (parts.length === 2) {
            // Year suggestions (last 5 years)
            const currentYear = new Date().getFullYear();
            matches = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())
              .filter(year => year.startsWith(lastPart))
              .map(year => `${year} (Season)`);
          } else if (parts.length === 3) {
            // Round suggestions (1-23)
            matches = Array.from({ length: 23 }, (_, i) => (i + 1).toString())
              .filter(round => round.startsWith(lastPart))
              .map(round => `${round} (Round)`);
          }
          break;

        case '/qualifying':
        case '/q':
        case '/sprint':
        case '/sp':
        case '/fastest':
        case '/f':
        case '/pitstops':
        case '/p':
          if (parts.length === 2) {
            // Year suggestions
            const currentYear = new Date().getFullYear();
            matches = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())
              .filter(year => year.startsWith(lastPart));
          } else if (parts.length === 3) {
            // Round suggestions
            matches = Array.from({ length: 23 }, (_, i) => (i + 1).toString())
              .filter(round => round.startsWith(lastPart));
          }
          break;

        // Live Data Commands
        case '/telemetry':
        case '/tires':
          // Driver number suggestions
          const driverNumbers = Object.values(driverNicknames)
            .map(nicknames => nicknames.find(n => /^\d+$/.test(n)))
            .filter(Boolean)
            .map((num, idx) => {
              const driver = Object.values(driverNicknames)[idx][0];
              return `${num} (${driver})`;
            }) as string[];
          matches = deduplicate(driverNumbers.filter(entry => 
            entry.split(' ')[0].startsWith(lastPart)
          ));
          break;

        case '/theme':
          // Team theme suggestions
          const themes = [
            ...Object.values(teamNicknames).map(names => `${names[0]} (Team Colors)`),
            'default (Reset Theme)'
          ];
          matches = deduplicate(themes.filter(theme => 
            theme.split(' ')[0].toLowerCase().startsWith(lastPart.toLowerCase())
          ));
          break;

        case '/list':
        case '/ls':
          // List type suggestions
          matches = [
            'drivers (List all F1 drivers)',
            'teams (List all F1 teams)',
            'tracks (List all F1 circuits)'
          ].filter(type =>
            type.split(' ')[0].startsWith(lastPart.toLowerCase())
          );
          break;

        case '/fontsize':
          // Font size suggestions
          matches = [
            'reset (Default size)',
            '+ (Increase size)',
            '- (Decrease size)',
            '12 (Small)',
            '14 (Medium)',
            '16 (Large)',
            '18 (Extra Large)'
          ].filter(size =>
            size.split(' ')[0].startsWith(lastPart)
          );
          break;

        case '/driver':
        case '/d':
          // Driver name completion with deduplication
          const driverNames = deduplicate(Object.values(driverNicknames).flat());
          matches = deduplicate(driverNames.filter(name => 
            name.toLowerCase().startsWith(lastPart.toLowerCase())
          ));
          break;
          
        case '/track':
        case '/t':
          // Track name completion with deduplication
          const trackNames = deduplicate(Object.values(trackNicknames).flat());
          matches = deduplicate(trackNames.filter(name => 
            name.toLowerCase().startsWith(lastPart.toLowerCase())
          ));
          break;
          
        case '/team':
        case '/tm':
          // Team name completion with deduplication
          const teamNames = deduplicate(Object.values(teamNicknames).flat());
          matches = deduplicate(teamNames.filter(name => 
            name.toLowerCase().startsWith(lastPart.toLowerCase())
          ));
          break;
          
        case '/compare':
        case '/m':
          if (parts.length === 2) {
            // Type completion
            matches = ['driver', 'team'].filter(t => 
              t.startsWith(lastPart.toLowerCase())
            );
          } else if (parts[1] === 'driver') {
            // Driver name completion for comparison
            const driverNames = Object.values(driverNicknames).flat();
            matches = deduplicate(driverNames.filter(name => 
              name.toLowerCase().startsWith(lastPart.toLowerCase())
            ));
          } else if (parts[1] === 'team') {
            // Team name completion for comparison
            const teamNames = Object.values(teamNicknames).flat();
            if (parts.length === 3) {
              // First team name
              matches = deduplicate(teamNames
                .filter(name => name.toLowerCase().startsWith(lastPart.toLowerCase()))
                .map(name => `${name} (First Team)`));
            } else if (parts.length === 4) {
              // Second team name, exclude the first team
              const firstTeam = parts[2].toLowerCase();
              matches = deduplicate(teamNames
                .filter(name => 
                  name.toLowerCase().startsWith(lastPart.toLowerCase()) &&
                  name.toLowerCase() !== firstTeam
                )
                .map(name => `${name} (Second Team)`));
            }
          }
          break;

        case '/mt':
          // Team comparison shortcut
          if (parts.length === 2) {
            // First team name
            const teamNames = Object.values(teamNicknames).flat();
            matches = deduplicate(teamNames
              .filter(name => name.toLowerCase().startsWith(lastPart.toLowerCase()))
              .map(name => `${name} (First Team)`));
          } else if (parts.length === 3) {
            // Second team name, exclude the first team
            const teamNames = Object.values(teamNicknames).flat();
            const firstTeam = parts[1].toLowerCase();
            matches = deduplicate(teamNames
              .filter(name => 
                name.toLowerCase().startsWith(lastPart.toLowerCase()) &&
                name.toLowerCase() !== firstTeam
              )
              .map(name => `${name} (Second Team)`));
          }
          break;
      }
    }

    // Ensure unique suggestions and sort them
    setSuggestions(deduplicate(matches).sort((a, b) => a.localeCompare(b)));
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
        setTimeout(() => {
          inputRef.current?.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
        }, 0);
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
            handleSelect(suggestions[selectedIndex] + ' ');
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
              const [value, description] = suggestion.includes('(') ? 
                [suggestion.split(' (')[0], `(${suggestion.split('(')[1]}`] : 
                [suggestion, ''];
              const isSelected = index === selectedIndex;
              
              return (
                <motion.div
                  key={`${suggestion}-${index}`}
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
                      {value}
                      {description && (
                        <span className="text-muted-foreground/70 ml-2 text-xs tracking-wide">
                          {description}
                        </span>
                      )}
                      {isAlias && (
                        <span className="text-secondary/70 ml-2 text-xs tracking-wide">
                          → {commandAliases[suggestion]}
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