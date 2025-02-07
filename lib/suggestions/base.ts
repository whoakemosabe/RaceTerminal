// Base types for the suggestion system
export interface Suggestion {
  value: string;
  description?: string;
  alias?: string;
}

export interface SuggestionProvider {
  getCompletions(input: string, parts: string[]): Suggestion[];
}

export function deduplicate(suggestions: Suggestion[]): Suggestion[] {
  const seen = new Set<string>();
  return suggestions.filter(suggestion => {
    if (seen.has(suggestion.value)) return false;
    seen.add(suggestion.value);
    return true;
  });
}