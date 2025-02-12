import { driverNicknames, countryToCode, driverNumbers } from '@/lib/utils';
import { Suggestion, SuggestionProvider, deduplicate } from './base';

function formatDriverSuggestion(id: string, nicknames: string[]): Suggestion {
  const name = nicknames[0];
  const code = nicknames.find(n => n.length === 3 && n === n.toUpperCase()) || '';
  const nationality = nicknames.find(n => countryToCode[n]) || '';
  const number = driverNumbers[id] || '';
  
  return {
    value: name,
    description: `${code}${number ? ` | #${number.padStart(2, '0')}` : ''}`,
    suffix: nationality
  };
}

export class DriverSuggestionProvider implements SuggestionProvider {
  getCompletions(input: string, parts: string[]): Suggestion[] {
    const searchTerm = input.toLowerCase();
    const suggestions: Suggestion[] = [];
    
    // First check if input is a number
    if (/^\d+$/.test(searchTerm)) {
      // Search by driver number
      Object.entries(driverNumbers).forEach(([id, number]) => {
        if (number === searchTerm) {
          const nicknames = driverNicknames[id];
          if (nicknames) {
            suggestions.push(formatDriverSuggestion(id, nicknames));
          }
        }
      });
    }

    // Add all matching drivers
    Object.entries(driverNicknames).forEach(([id, nicknames]) => {
      const name = nicknames[0].toLowerCase();
      const code = nicknames.find(n => n.length === 3)?.toLowerCase() || '';
      const number = driverNumbers[id];
      
      // Match against name, code, number, or nickname
      if (name.includes(searchTerm) || 
          code.includes(searchTerm) || 
          number === searchTerm ||
          nicknames.some(n => n.toLowerCase().includes(searchTerm))) {
        suggestions.push(formatDriverSuggestion(id, nicknames));
      }
    });

    return deduplicate(suggestions);
  }
}