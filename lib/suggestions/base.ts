// Base types for the suggestion system
export interface Suggestion {
  value: string;
  description?: string;
  metadata?: string;
  alias?: string;
  suffix?: string;
  id?: string;
}

export interface SuggestionProvider {
  getCompletions(input: string, parts: string[]): Suggestion[];
}

export function deduplicate(suggestions: Suggestion[]): Suggestion[] {
  // Use Map for O(1) lookups and preserve last occurrence of each value
  const uniqueMap = new Map<string, Suggestion>();
  suggestions.forEach(suggestion => {
    uniqueMap.set(suggestion.value, suggestion);
  });
  return Array.from(uniqueMap.values());
}