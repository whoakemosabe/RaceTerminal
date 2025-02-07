import { teamNicknames } from '@/lib/utils';
import { Suggestion, SuggestionProvider, deduplicate } from './base';

export class TeamSuggestionProvider implements SuggestionProvider {
  getCompletions(input: string, parts: string[]): Suggestion[] {
    const suggestions = Object.values(teamNicknames)
      .map(([name, code, _, hq, established]) => ({
        value: name,
        description: `${code}, ${hq}, Est. ${established}`
      }))
      .filter(suggestion => 
        suggestion.value.toLowerCase().includes(input.toLowerCase())
      );

    return deduplicate(suggestions);
  }
}