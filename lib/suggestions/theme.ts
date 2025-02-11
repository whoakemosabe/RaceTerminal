import { Suggestion, SuggestionProvider, deduplicate } from './base';
import { teamNicknames, getTeamColor } from '@/lib/utils';
import { colorThemes } from '@/lib/themes/colors';
import { calculatorThemes } from '@/lib/themes/calculator';

export class ThemeSuggestionProvider implements SuggestionProvider {
  getCompletions(input: string): Suggestion[] {
    const searchTerm = input.toLowerCase();
    const suggestions: Suggestion[] = [];
    
    // Always show all themes, filter based on search term
    const addThemes = () => {
      // Add team themes
      Object.entries(teamNicknames).forEach(([id, names]) => {
        const teamName = names[0];
        const shortName = names[2].toLowerCase();

        // Check if search matches any part of the team name or code
        const matches = !searchTerm || 
          names.some(name => 
            name.toLowerCase().includes(searchTerm) || 
            name.toLowerCase().replace(/\s+/g, '').includes(searchTerm)
          );

        if (matches) {
          suggestions.push({
            value: teamName,
            description: `Team Theme (${shortName.toUpperCase()}, Est. ${names[4]})`
          });
        }
      });

      // Add VSCode themes
      Object.entries(colorThemes).forEach(([id, theme]) => {
        if (!searchTerm || id.toLowerCase().includes(searchTerm)) {
          suggestions.push({
            value: id,
            description: theme.description || 'Editor color theme'
          });
        }
      });

      // Add calculator themes
      Object.entries(calculatorThemes).forEach(([id, theme]) => {
        if (!searchTerm || id.toLowerCase().includes(searchTerm)) {
          suggestions.push({
            value: `calc ${id}`,
            description: theme.description || 'Calculator LCD theme'
          });
        }
      });

      // Add default theme
      if (!searchTerm || 'default'.includes(searchTerm)) {
        suggestions.push({
          value: 'default',
          description: 'Reset to default terminal colors'
        });
      }
    };

    // Handle calculator theme search
    if (searchTerm.startsWith('calc')) {
      const calcSearch = searchTerm.replace('calc', '').trim();
      Object.entries(calculatorThemes).forEach(([id, theme]) => {
        if (!calcSearch || id.toLowerCase().includes(calcSearch)) {
          suggestions.push({
            value: `calc ${id}`,
            description: theme.description || 'Calculator LCD theme'
          });
        }
      });
      return deduplicate(suggestions);
    }

    // Add all themes and filter based on search term
    addThemes();

    return this.sortSuggestions(suggestions);
  }

  private sortSuggestions(suggestions: Suggestion[]): Suggestion[] {
    const getOrder = (value: string): number => {
      if (value === 'default') return 4;
      if (value.startsWith('calc')) return 3;
      if (Object.keys(colorThemes).includes(value)) return 2;
      return 1; // Team themes first
    };

    return deduplicate(suggestions.sort((a, b) => {
      const orderA = getOrder(a.value);
      const orderB = getOrder(b.value);
      if (orderA === orderB) {
        return a.value.localeCompare(b.value);
      }
      return orderA - orderB;
    }));
  }
}