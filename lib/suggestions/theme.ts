import { Suggestion, SuggestionProvider, deduplicate } from './base';
import { teamNicknames, getTeamColor, teamThemes } from '@/lib/utils';
import { colorThemes } from '@/lib/themes/colors';
import { calculatorThemes } from '@/lib/themes/calculator';
import { commands } from '@/lib/commands';

export class ThemeSuggestionProvider implements SuggestionProvider {
  getCompletions(input: string): Suggestion[] {
    const searchTerm = input.toLowerCase();
    const suggestions: Suggestion[] = [];

    // Handle calculator theme suggestions
    if (searchTerm.startsWith('calc')) {
      // If just 'calc' or 'calc ', show all calculator themes
      const calcSearch = searchTerm.replace('calc', '').trim();
      if (!calcSearch) {
        Object.entries(calculatorThemes).forEach(([name, theme]) => {
          suggestions.push({
            value: `calc ${name}`,
            description: theme.description || 'Calculator theme',
            suffix: `<div style="display:inline-block;padding:2px 8px;background:${theme.bg};color:${theme.text};border:1px solid ${theme.text};border-radius:3px;font-family:monospace">123</div>`
          });
        });
        return suggestions;
      }
      
      // If typing after 'calc ', filter calculator themes
      Object.entries(calculatorThemes).forEach(([name, theme]) => {
        if (name.toLowerCase().includes(calcSearch)) {
          suggestions.push({
            value: `calc ${name}`,
            description: theme.description || 'Calculator theme',
            suffix: `<div style="display:inline-block;padding:2px 8px;background:${theme.bg};color:${theme.text};border:1px solid ${theme.text};border-radius:3px;font-family:monospace">123</div>`
          });
        }
      });
      return suggestions;
    }
    
    // Get theme commands from main commands array
    const themeCommands = commands.filter(cmd => 
      cmd.command.startsWith('/theme') || 
      cmd.command.startsWith('/colors')
    );

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
          description: `Team Theme (Est. ${names[4]})`,
          suffix: shortName.toUpperCase()
        });
      }
    });

    // Add VSCode themes
    Object.entries(colorThemes).forEach(([id, theme]) => {
      if (!searchTerm || id.toLowerCase().includes(searchTerm)) {
        suggestions.push({
          value: id,
          description: theme.description || 'Editor color theme',
          suffix: id
        });
      }
    });

    const addThemes = () => {
      // Add default theme
      if (!searchTerm || 'default'.includes(searchTerm)) {
        suggestions.push({
          value: 'default',
          description: 'Reset to default terminal colors'
        });
      }
    };

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