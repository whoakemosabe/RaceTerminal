'use client'

import { useEffect, useState, useRef, useCallback } from 'react';
import { commands } from '@/lib/commands';
import { commandAliases } from '@/components/terminal/command-processor';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { teamNicknames, trackNicknames, getTrackDetails, getTeamColor } from '@/lib/utils';
import { driverNicknames, driverNumbers, findDriverId, findDriverByNumber } from '@/lib/utils/drivers';
import { countryToCode } from '@/lib/utils/countries';
import { LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';

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
  const [suggestions, setSuggestions] = useState<{value: string, description?: string, alias?: string}[]>([]);
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
    // Extract the actual value without description and code/nationality
    let value = suggestion.includes('(') ? suggestion.split(' (')[0].trim() : suggestion.trim();
    
    // Split command into parts
    const parts = command.split(' ');
    const firstPart = parts[0];
    
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
      
      if (parts.length === 1) {
        onSelect(`${parts[0]} ${value}`);
      } else {
        onSelect(`${parts[0]} ${value}`);
      }
      
      setTimeout(() => {
        if (onShowSuggestionsChange) {
          onShowSuggestionsChange(true);
        }
        inputRef.current?.dispatchEvent(new Event('focus'));
      }, 0);
      return;
    }
    
    // Special handling for compare commands
    if (['/compare', '/m'].includes(parts[0])) {
      if (parts.length === 1) {
        onSelect(`${parts[0]} ${value}`);
        setTimeout(() => {
          if (onShowSuggestionsChange) {
            onShowSuggestionsChange(true);
          }
          inputRef.current?.dispatchEvent(new Event('focus'));
        }, 0);
      } else {
        const prefix = parts.slice(0, -1).join(' ').trimEnd();
        onSelect(`${prefix} ${value}`);
        if (parts[1] === 'driver' || parts[1] === 'team') {
          setTimeout(() => {
            if (onShowSuggestionsChange) {
              onShowSuggestionsChange(true);
            }
            inputRef.current?.dispatchEvent(new Event('focus'));
          }, 0);
        }
      }
    } else {
      // Standard handling for other commands
      if (parts.length > 1) {
        const prefix = parts.slice(0, -1).join(' ').trimEnd();
        onSelect(`${prefix} ${value}`);
      } else {
        onSelect(`${value}`);
      }
    }

    // Keep focus on input but don't add space
    const input = inputRef.current;
    if (input) {
      input.focus();
      // Set cursor position to end of input
      requestAnimationFrame(() => {
        const length = input.value.length;
        input.setSelectionRange(length, length);
      });
    }
  };

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


    // Helper function to deduplicate suggestions
    const deduplicate = (items: {value: string, description?: string, alias?: string}[]): {value: string, description?: string, alias?: string}[] => {
      return Array.from(new Set(items.map(item => item.value))).map(value => 
        items.find(item => item.value === value)!
      );
    };

    // If no username is set, only show /user command
    if (!hasSetUsername) {
      const userCommands = ['/user', '/u'];
      const matches = userCommands
        .filter(c => c.startsWith(firstPart))
        .map(c => ({ value: c }));
      setSuggestions(matches);
      return;
    }

    let matches: {value: string, description?: string, alias?: string}[] = [];

    // Handle command completion
    if (parts.length === 1) {
      setSuggestionType('command');
      const commandSuggestions = [];
      
      // Add base commands with their attributes
      commands.forEach(c => {
        const [baseCmd, ...attrs] = c.command.split(' ');
        if (baseCmd.startsWith(firstPart)) {
          const value = baseCmd.replace(/\s*\(.*?\)/, '').trim();
          commandSuggestions.push({
            value,
            description: c.description,
            ...(attrs.length > 0 && { description: `${attrs.join(' ')} (${c.description})` })
          });
        }
      });
      
      // Add aliases with their mapped commands
      Object.entries(commandAliases).forEach(([alias, target]) => {
        if (alias.startsWith(firstPart)) {
          const targetCmd = commands.find(c => c.command.startsWith(target.split(' ')[0]));
          if (targetCmd) {
            const cleanAlias = alias.replace(/\s*\(.*?\)/, '').trim();
            commandSuggestions.push({
              value: cleanAlias,
              description: targetCmd.description,
              alias: target
            });
          }
        }
      });
      
      matches = commandSuggestions;
    } else {
      setSuggestionType('argument');
      // Handle argument completion based on command
      const baseCommand = commandAliases[firstPart] || firstPart;
      const lastPart = parts[parts.length - 1];

      switch (baseCommand) {
        case '/list':
        case '/ls':
          matches = [
            { value: 'drivers', description: 'List all F1 drivers' },
            { value: 'teams', description: 'List all F1 teams' },
            { value: 'tracks', description: 'List all F1 circuits' },
            { value: 'themes', description: 'List all available themes' }
          ].filter(s => lastPart === '' || s.value.toLowerCase().includes(lastPart));
          break;

        case '/compare':
        case '/m':
          if (parts.length === 2) {
            if (lastPart === '') {
              matches = [
                { value: 'driver', description: 'Compare driver statistics' },
                { value: 'team', description: 'Compare team statistics' }
              ];
            } else {
              matches = [
                { value: 'driver', description: 'Compare driver statistics' },
                { value: 'team', description: 'Compare team statistics' }
              ].filter(s => s.value.startsWith(lastPart));
            }
          } else if (parts[1] === 'driver') {
            matches = [
              ...Object.values(driverNicknames)
              .map(nicknames => {
                const name = nicknames[0];
                const code = nicknames.find(n => n.length === 3 && n === n.toUpperCase());
                return { value: name, description: code };
              })
              .filter(s => lastPart === '' || s.value.toLowerCase().includes(lastPart))
            ];
          } else if (parts[1] === 'team') {
            matches = [
              ...Object.values(teamNicknames)
              .map(([name, code]) => ({ value: name, description: code }))
              .filter(s => lastPart === '' || s.value.toLowerCase().includes(lastPart))
            ];
          }
          break;

        case '/driver':
        case '/d':
          matches = [
            ...Object.values(driverNicknames)
            .map(nicknames => {
              const name = nicknames[0];
              const code = nicknames.find(n => n.length === 3 && n === n.toUpperCase());
              const nationality = nicknames.find(n => countryToCode[n]);
              return { value: name, description: `${code}, ${nationality}` };
            })
            .filter(s => lastPart === '' || s.value.toLowerCase().includes(lastPart))
          ];
          break;

        case '/track':
        case '/t':
          matches = [
            ...Object.entries(trackNicknames)
            .map(([id, [name, nickname]]) => {
              const details = getTrackDetails(id);
              return { value: name, description: `${nickname}, ${details.length}km, ${details.turns} turns` };
            })
            .filter(s => lastPart === '' || s.value.toLowerCase().includes(lastPart))
          ];
          break;

        case '/team':
        case '/tm':
          matches = [
            ...Object.values(teamNicknames)
            .map(([name, code, _, hq, established]) => ({ 
              value: name, 
              description: `${code}, ${hq}, Est. ${established}` 
            }))
            .filter(s => lastPart === '' || s.value.toLowerCase().includes(lastPart))
          ];
          break;
      }
    }

    // Ensure unique suggestions and sort them
    setSuggestions(deduplicate(matches).sort((a, b) => a.value.localeCompare(b.value)));
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
      
      // Handle Enter key for suggestion selection
      if (e.key === 'Enter' && suggestions[selectedIndex]) {
        e.preventDefault();
        handleSelect(suggestions[selectedIndex].value);
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
            handleSelect(suggestions[selectedIndex].value);
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