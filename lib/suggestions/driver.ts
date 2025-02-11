import { driverNicknames, countryToCode } from '@/lib/utils';
import { Suggestion, SuggestionProvider, deduplicate } from './base';

export class DriverSuggestionProvider implements SuggestionProvider {
  getCompletions(input: string, parts: string[]): Suggestion[] {
    const suggestions = Object.values(driverNicknames)
      .map(nicknames => {
        const name = nicknames[0];
        const code = nicknames.find(n => n.length === 3 && n === n.toUpperCase());
        const nationality = nicknames.find(n => countryToCode[n]);
        return {
          value: name,
          description: `${code}, ${nationality}`
        };
      })
      .filter(suggestion => 
        suggestion.value.toLowerCase().includes(input.toLowerCase())
      );

    return deduplicate(suggestions);
  }
}