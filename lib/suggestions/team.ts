import { teamNicknames } from '@/lib/utils';
import { Suggestion, SuggestionProvider, deduplicate } from './base';

interface TeamSuggestion extends Suggestion {
  id?: string;
}

interface TeamSuggestion extends Suggestion {
  id?: string;
}

export class TeamSuggestionProvider implements SuggestionProvider {
  getCompletions(input: string, parts: string[]): Suggestion[] {
    const searchTerm = (input || '').toLowerCase().trim();
    const suggestions: TeamSuggestion[] = [];
    
    // Process each team
    Object.entries(teamNicknames).forEach(([id, [name, code, nickname, hq, established, championships]]) => {
      // Show all teams when no search term
      if (!searchTerm) {
        suggestions.push({
          value: name,
          description: `${code} | ${championships} Championships | ${hq}`,
          id
        });
        return;
      }
      
      // Build search terms array
      const searchTerms = [
        name.toLowerCase(),
        code.toLowerCase(),
        nickname.toLowerCase(),
        id.replace(/_/g, ' ').toLowerCase(),
        hq.toLowerCase()
      ];
      
      // Add team-specific variations
      switch (id) {
        case 'ferrari':
          searchTerms.push('ferrari', 'scuderia', 'sf', 'maranello');
          break;
        case 'red_bull':
          searchTerms.push('redbull', 'rb', 'rbr', 'red bull', 'milton keynes');
          break;
        case 'mercedes':
          searchTerms.push('merc', 'mercs', 'amg', 'petronas', 'brackley');
          break;
        case 'alphatauri':
          searchTerms.push('alpha', 'tauri', 'at', 'racing bulls', 'faenza');
          break;
        case 'mclaren':
          searchTerms.push('mcl', 'papaya', 'woking');
          break;
        case 'aston_martin':
          searchTerms.push('aston', 'amr', 'silverstone');
          break;
      }
      
      // Check if any search term matches
      if (searchTerms.some(term => term.includes(searchTerm) || searchTerm.includes(term))) {
        suggestions.push({
          value: name,
          description: `${code} | ${championships} Championships | ${hq}`,
          id
        });
      }
    });

    return deduplicate(suggestions.sort((a, b) => a.value.localeCompare(b.value)));
  }
}