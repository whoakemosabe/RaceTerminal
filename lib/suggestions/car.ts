import { Suggestion, SuggestionProvider, deduplicate } from './base';
import { F1_CARS } from '@/lib/data/cars';

export class CarSuggestionProvider implements SuggestionProvider {
  getCompletions(input: string): Suggestion[] {
    if (!input) {
      // Show all cars when no input
      return Object.entries(F1_CARS).map(([id, car]) => ({
        value: id,
        description: car.name,
        suffix: `${car.year} | ${car.team}`,
        metadata: id // Show the exact ID to use
      }));
    }

    const search = input.toLowerCase();
    const suggestions: Suggestion[] = [];

    // Search through cars
    Object.entries(F1_CARS).forEach(([id, car]) => {
      const searchTerms = [
        id,                                    // Exact ID (e.g., 'mp4-4')
        id.replace(/[/-]/g, ''),              // ID without hyphens
        car.name.toLowerCase(),               // Full name
        car.team.toLowerCase(),               // Team name
        car.name.split(/[\s/]+/).pop()?.toLowerCase() || '', // Model number
        car.name.split(/[\s/]+/).pop()?.replace(/[/-]/g, '').toLowerCase() || '' // Model without hyphens
      ];

      if (searchTerms.some(term => term.includes(search))) {
        suggestions.push({
          value: id,
          description: car.name,
          suffix: `${car.year} | ${car.team}`,
          metadata: id // Show the exact ID to use
        });
      }
    });

    // Sort by year (newest first)
    return deduplicate(suggestions.sort((a, b) => {
      const yearA = parseInt(a.suffix.split('|')[0].trim());
      const yearB = parseInt(b.suffix.split('|')[0].trim());
      return yearB - yearA;
    }));
  }
}