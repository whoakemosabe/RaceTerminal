import { driverNicknames, countryToCode, driverNumbers } from '@/lib/utils';
import { Suggestion, SuggestionProvider, deduplicate } from './base';

function getDriverSuggestions(input: string): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const searchTerm = input.toLowerCase().trim();
  const isNumberSearch = /^\d+$/.test(searchTerm);
  const isCodeSearch = searchTerm.length === 3 && searchTerm === searchTerm.toUpperCase();

  // If no search term, show all drivers
  if (!searchTerm) {
    Object.entries(driverNicknames).forEach(([id, nicknames]) => {
      const name = nicknames[0];
      const code = nicknames.find(n => n.length === 3 && n === n.toUpperCase());
      const nationality = nicknames.find(n => countryToCode[n]);
      const number = driverNumbers[id];
      const mainNickname = nicknames.find(n => 
        !n.includes(',') && // Not championship years
        !countryToCode[n] && // Not nationality
        n !== id && // Not ID
        n !== name && // Not full name
        n !== code && // Not driver code
        !/^\d+$/.test(n) && // Not driver number
        n.length > 1 // Must be longer than 1 character
      );

      suggestions.push({
        value: name,
        description: [
          number ? `#${number}` : null,
          code,
          nationality,
          mainNickname
        ].filter(Boolean).join(', ')
      });
    });
    return suggestions.sort((a, b) => a.value.localeCompare(b.value));
  }

  Object.entries(driverNicknames).forEach(([id, nicknames]) => {
    const name = nicknames[0];
    const code = nicknames.find(n => n.length === 3 && n === n.toUpperCase());
    const nationality = nicknames.find(n => countryToCode[n]);
    const number = driverNumbers[id];
    
    // Get searchable nicknames (excluding special entries)
    const searchableNicknames = nicknames.filter(n =>
      !n.includes(',') && // Not championship years
      !countryToCode[n] && // Not nationality
      n !== id && // Not ID
      n !== code && // Not driver code
      !/^\d+$/.test(n) && // Not driver number
      n.length > 1 // Must be longer than 1 character
    );

    // Search by number
    if (isNumberSearch && number && number.startsWith(searchTerm)) {
      suggestions.push({
        value: name,
        description: `#${number}, ${code}, ${nationality}`
      });
      return;
    }
    // Search by code
    if (isCodeSearch && code?.toLowerCase() === searchTerm) {
      suggestions.push({
        value: name,
        description: `#${number}, ${code}, ${nationality}`
      });
      return;
    }

    // Multiple search criteria
    const matches = [
      // Full name match
      name.toLowerCase().includes(searchTerm),
      // First/Last name match
      name.toLowerCase().split(' ').some(part => part.startsWith(searchTerm)),
      // Code match
      code?.toLowerCase().startsWith(searchTerm),
      // Nickname matches
      searchableNicknames.some(nick => nick.toLowerCase().includes(searchTerm)),
      // ID match (for special cases like 'bruce' or 'mclaren')
      id.toLowerCase().includes(searchTerm)
    ];

    if (matches.some(Boolean)) {
      const description = [
        number ? `#${number}` : null,
        code,
        nationality,
        searchableNicknames[0]
      ].filter(Boolean).join(', ');

      suggestions.push({ value: name, description });
    }
  });

  // Sort suggestions
  if (isNumberSearch) {
    return suggestions.sort((a, b) => {
      const numA = parseInt(a.description.match(/#(\d+)/)?.[1] || '0');
      const numB = parseInt(b.description.match(/#(\d+)/)?.[1] || '0');
      return numA - numB;
    });
  }

  // Sort by exact matches first, then alphabetically
  return suggestions.sort((a, b) => {
    const aExact = a.value.toLowerCase().startsWith(searchTerm);
    const bExact = b.value.toLowerCase().startsWith(searchTerm);
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    return a.value.localeCompare(b.value);
  });
  return suggestions.sort((a, b) => a.value.localeCompare(b.value));
}

export class DriverSuggestionProvider implements SuggestionProvider {
  getCompletions(input: string, parts: string[]): Suggestion[] {
    return deduplicate(getDriverSuggestions(input));
  }
}