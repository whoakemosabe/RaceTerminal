import { Suggestion, SuggestionProvider, deduplicate } from './base';

export class CarSuggestionProvider implements SuggestionProvider {
  getCompletions(input: string): Suggestion[] {
    const searchTerm = input.toLowerCase();
    
    // List of available cars with their descriptions
    const cars = [
      // Current Cars (2024)
      { value: 'rb20', description: 'Red Bull RB20 (2024)' },
      { value: 'w15', description: 'Mercedes W15 (2024)' },
      { value: 'sf24', description: 'Ferrari SF-24 (2024)' },
      
      // Previous Season (2023)
      { value: 'rb19', description: 'Red Bull RB19 (2023)' },
      { value: 'w14', description: 'Mercedes W14 (2023)' },
      { value: 'sf23', description: 'Ferrari SF-23 (2023)' },
      { value: 'amr23', description: 'Aston Martin AMR23 (2023)' },
      { value: 'mcl60', description: 'McLaren MCL60 (2023)' },
      { value: 'a523', description: 'Alpine A523 (2023)' },
      
      // Historic Championship Cars
      { value: 'mp4-4', description: 'McLaren MP4/4 (1988) - Most dominant car of its era' },
      { value: 'f2004', description: 'Ferrari F2004 (2004) - Most successful Ferrari F1 car' },
      { value: 'fw14b', description: 'Williams FW14B (1992) - Revolutionary active suspension' },
      { value: 'rb9', description: 'Red Bull RB9 (2013) - 9 consecutive wins with Vettel' },
      { value: 'w11', description: 'Mercedes W11 (2020) - Most dominant Mercedes car' },
      
      // Search by year
      { value: '2024', description: 'Show all 2024 Formula 1 cars' },
      { value: '2023', description: 'Show all 2023 Formula 1 cars' },
      { value: '2020', description: 'Show Mercedes W11 championship car' },
      { value: '2013', description: 'Show Red Bull RB9 championship car' },
      { value: '2004', description: 'Show Ferrari F2004 championship car' },
      { value: '1992', description: 'Show Williams FW14B championship car' },
      { value: '1988', description: 'Show McLaren MP4/4 championship car' },
      
      // Search by team
      { value: 'redbull', description: 'Show Red Bull Racing cars' },
      { value: 'mercedes', description: 'Show Mercedes F1 cars' },
      { value: 'ferrari', description: 'Show Ferrari F1 cars' },
      { value: 'mclaren', description: 'Show McLaren F1 cars' },
      { value: 'williams', description: 'Show Williams F1 cars' }
    ];

    // If no search term, return all suggestions
    if (!searchTerm) {
      return deduplicate(cars);
    }

    // Filter suggestions based on input
    const suggestions = cars.filter(car => 
      car.value.toLowerCase().includes(searchTerm) ||
      car.description.toLowerCase().includes(searchTerm)
    );

    return deduplicate(suggestions);
  }
}