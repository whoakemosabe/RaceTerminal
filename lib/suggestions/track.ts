import { trackNicknames, getTrackDetails } from '@/lib/utils';
import { Suggestion, SuggestionProvider, deduplicate } from './base';

export class TrackSuggestionProvider implements SuggestionProvider {
  getCompletions(input: string): Suggestion[] {
    const searchTerm = input?.toLowerCase().trim() || '';
    const normalizedSearch = searchTerm.replace(/[-\s_]+/g, '').toLowerCase();
    const suggestions: Suggestion[] = [];
    
    // Special case handling for common variations
    const specialTerms = {
      'spa': ['spa', 'francorchamps', 'ardennes', 'belgian', 'spafrancorchamps'],
      'monza': ['monza', 'autodromo', 'nazionale', 'temple'],
      'silverstone': ['silverstone', 'british'],
      'monaco': ['monaco', 'monte carlo']
    };

    // Process all tracks
    Object.entries(trackNicknames).forEach(([id, nicknames]) => {
      const [name, nickname, code] = nicknames;
      const details = getTrackDetails(id);

      // Show all tracks when no search term
      if (!searchTerm) {
        suggestions.push({
          value: name,
          description: `${nickname} | ${details.length}km | ${details.turns} turns`,
          suffix: code
        });
        return;
      }

      // Normalize searchable terms
      const searchableTerms = [
        ...nicknames.map(n => n.toLowerCase()),                    // Original nicknames
        ...nicknames.map(n => n.replace(/[-\s_]+/g, '').toLowerCase()), // Normalized nicknames
        id.replace(/_/g, '').toLowerCase(),                       // Track ID
        ...(specialTerms[id] || []).map(t => t.toLowerCase())    // Special terms
      ];

      // Check if any term matches the search
      const matches = searchableTerms.some(term => 
        term === normalizedSearch ||                             // Exact match
        term.startsWith(normalizedSearch) ||                     // Starts with search
        term.includes(normalizedSearch)                          // Contains search
      );

      if (matches) {
        suggestions.push({
          value: name,
          description: nickname,
          suffix: `${details.turns}T`
        });
      }
    });

    return deduplicate(suggestions);
  }
}