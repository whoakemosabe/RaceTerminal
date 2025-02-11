import { Suggestion, SuggestionProvider, deduplicate } from './base';

export class ListSuggestionProvider implements SuggestionProvider {
  getCompletions(input: string): Suggestion[] {
    const suggestions = [
      { value: 'drivers', description: 'List all F1 drivers with details' },
      { value: 'teams', description: 'List all F1 teams and achievements' },
      { value: 'tracks', description: 'List all F1 circuits and records' },
      { value: 'themes', description: 'List all available terminal themes' }
    ].filter(suggestion => 
      suggestion.value.toLowerCase().includes(input.toLowerCase())
    );

    return deduplicate(suggestions);
  }
}