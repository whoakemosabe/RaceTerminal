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
    const teamSearchTerms = new Map<string, string[]>();
    
    // Process each team
    Object.entries(teamNicknames).forEach(([id, [name, code, nickname, hq, established, championships]]) => {
      // Pre-compute search terms for each team
      if (!teamSearchTerms.has(id)) {
        const terms = [
          name.toLowerCase(),
          code.toLowerCase(),
          nickname.toLowerCase(),
          id.replace(/_/g, ' ').toLowerCase(),
          hq.toLowerCase()
        ];
        
        // Add team-specific variations
        switch (id) {
          case 'ferrari':
            terms.push('ferrari', 'scuderia', 'sf', 'maranello');
            break;
          case 'red_bull':
            terms.push('redbull', 'rb', 'rbr', 'red bull', 'milton keynes');
            break;
          case 'mercedes':
            terms.push('merc', 'mercs', 'amg', 'petronas', 'brackley');
            break;
          case 'alphatauri':
            terms.push('alpha', 'tauri', 'at', 'racing bulls', 'faenza');
            break;
          case 'mclaren':
            terms.push('mcl', 'papaya', 'woking');
            break;
          case 'aston_martin':
            terms.push('aston', 'amr', 'silverstone');
            break;
        }
        teamSearchTerms.set(id, terms);
      }

      // Show all teams when no search term
      if (!searchTerm) {
        suggestions.push({
          value: name,
          description: hq,
          suffix: code,
          id,
          metadata: `${championships} Championships`
        });
        return;
      }
      
      const searchTerms = teamSearchTerms.get(id) || [];
      
      // Check if any search term matches
      if (searchTerms.some(term => term.includes(searchTerm) || searchTerm.includes(term))) {
        suggestions.push({
          value: name,
          description: hq,
          suffix: code,
          description: hq,
          suffix: code,
          id,
          metadata: `${championships} Championships`
        });
      }
    });

    return deduplicate(suggestions.sort((a, b) => a.value.localeCompare(b.value)));
  }
}