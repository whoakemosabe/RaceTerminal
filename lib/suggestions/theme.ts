import { Suggestion, SuggestionProvider, deduplicate } from './base';
import { teamNicknames, getTeamColor, teamThemes } from '@/lib/utils';
import { colorThemes } from '@/lib/themes/colors';
import { calculatorThemes } from '@/lib/themes/calculator';
import { commands } from '@/lib/commands';

export class ThemeSuggestionProvider implements SuggestionProvider {
  getCompletions(input: string): Suggestion[] {
  const searchTerm = input.toLowerCase(); // Keep input as is (preserve spaces)
  const suggestions: Suggestion[] = [];

  // Handle 'calc' and any input starting with 'calc ' (including trailing spaces)
  if (searchTerm.startsWith('calc ')) {
    const calcSearch = searchTerm.slice(5); // Get the part after 'calc '

    // If there's no search term after 'calc ', still show all themes
    if (calcSearch === '' || calcSearch.trim() === '') {
      this.addAllCalculatorThemes(suggestions);
    } else {
      this.addFilteredCalculatorThemes(suggestions, calcSearch);
    }
  } else if (searchTerm === 'calc') {
    // Show all calculator themes for 'calc'
    this.addAllCalculatorThemes(suggestions);
  } else if (searchTerm.startsWith('c')) {
    // Handle general input starting with 'c'
    this.addAllCalculatorThemes(suggestions);
  }

  // Handle team themes
  this.addTeamThemes(suggestions, searchTerm);

  // Handle VSCode themes
  this.addVscodeThemes(suggestions, searchTerm);

  // Add default theme
  this.addDefaultTheme(suggestions, searchTerm);

  return this.sortSuggestions(suggestions);
}



  private addAllCalculatorThemes(suggestions: Suggestion[]) {
    Object.entries(calculatorThemes).forEach(([name, theme]) => {
      suggestions.push({
        value: `calc ${name}`,
        description: theme.description || 'Calculator theme',
        suffix: `TERMINAL THEME`
      });
    });
  }

  private addFilteredCalculatorThemes(suggestions: Suggestion[], calcSearch: string) {
    Object.entries(calculatorThemes).forEach(([name, theme]) => {
      if (name.toLowerCase().includes(calcSearch)) {
        suggestions.push({
          value: `calc ${name}`,
          description: theme.description || 'Calculator theme',
          suffix: `TERMINAL THEME`
        });
      }
    });
  }

  private addTeamThemes(suggestions: Suggestion[], searchTerm: string) {
    Object.entries(teamNicknames).forEach(([id, names]) => {
      const teamName = names[0];
      const shortName = names[2].toLowerCase();

      const matches = names.some(name => 
        name.toLowerCase().includes(searchTerm) || 
        name.toLowerCase().replace(/\s+/g, '').includes(searchTerm)
      );

      if (matches) {
        suggestions.push({
          value: teamName,
          description: `Team Theme (Est. ${names[4]})`,
          suffix: 'TEAM THEME'
        });
      }
    });
  }

  private addVscodeThemes(suggestions: Suggestion[], searchTerm: string) {
    Object.entries(colorThemes).forEach(([id, theme]) => {
      if (id.toLowerCase().includes(searchTerm)) {
        suggestions.push({
          value: id,
          description: theme.description || 'Editor color theme',
          suffix: 'VSCODE'
        });
      }
    });
  }

  private addDefaultTheme(suggestions: Suggestion[], searchTerm: string) {
    if (!searchTerm || 'default'.includes(searchTerm)) {
      suggestions.push({
        value: 'default',
        description: 'Reset to default terminal colors'
      });
    }
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
      return orderA === orderB ? a.value.localeCompare(b.value) : orderA - orderB;
    }));
  }
}