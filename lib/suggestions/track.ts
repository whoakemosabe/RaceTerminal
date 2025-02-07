import { trackNicknames, getTrackDetails } from '@/lib/utils';
import { Suggestion, SuggestionProvider, deduplicate } from './base';

export class TrackSuggestionProvider implements SuggestionProvider {
  getCompletions(input: string): Suggestion[] {
    const suggestions = Object.entries(trackNicknames)
      .map(([id, [name, nickname]]) => {
        const details = getTrackDetails(id);
        return {
          value: name,
          description: `${nickname}, ${details.length}km, ${details.turns} turns`
        };
      })
      .filter(suggestion => 
        suggestion.value.toLowerCase().includes(input.toLowerCase())
      );

    return deduplicate(suggestions);
  }
}