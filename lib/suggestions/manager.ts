import { Suggestion } from './base';
import { CommandSuggestionProvider } from './command';
import { DriverSuggestionProvider } from './driver';
import { TeamSuggestionProvider } from './team';
import { TrackSuggestionProvider } from './track';
import { CarSuggestionProvider } from './car';
import { ThemeSuggestionProvider } from './theme';
import { ListSuggestionProvider } from './list';

export class SuggestionManager {
  private commandProvider = new CommandSuggestionProvider();
  private driverProvider = new DriverSuggestionProvider();
  private teamProvider = new TeamSuggestionProvider();
  private trackProvider = new TrackSuggestionProvider();
  private carProvider = new CarSuggestionProvider();
  private themeProvider = new ThemeSuggestionProvider();
  private listProvider = new ListSuggestionProvider();

  getSuggestions(command: string): Suggestion[] {
    if (!command.startsWith('/')) return [];

    const parts = command.toLowerCase().trim().split(/\s+/);
    const firstPart = parts[0];
    const lastPart = parts[parts.length - 1];

    // Base command suggestions
    if (parts.length === 1) {
      return this.commandProvider.getCompletions(firstPart);
    }

    // Argument suggestions based on command
    switch (firstPart) {
      case '/list':
      case '/ls':
        if (parts.length === 1 || (parts.length === 2 && !command.endsWith(' '))) {
          return this.listProvider.getCompletions(lastPart);
        }
        break;

      case '/driver':
      case '/d':
      case '/md':
        if (parts.length === 1 || (parts.length === 2 && !command.endsWith(' '))) {
          return this.driverProvider.getCompletions(lastPart, parts);
        }
        break;

      case '/team':
      case '/tm':
      case '/mt':
        if (parts.length === 1 || (parts.length === 2 && !command.endsWith(' '))) {
          return this.teamProvider.getCompletions(lastPart, parts);
        }
        break;

      case '/track':
      case '/t':
        if (parts.length === 1 || (parts.length === 2 && !command.endsWith(' '))) {
          return this.trackProvider.getCompletions(lastPart);
        }
        break;

      case '/car':
      case '/c':
        if (parts.length === 1 || (parts.length === 2 && !command.endsWith(' '))) {
          return this.carProvider.getCompletions(lastPart);
        }
        break;

      case '/theme':
        return this.themeProvider.getCompletions(lastPart);

      case '/colors':
        if (parts.length === 2 && parts[1] === 'calc') {
          return this.themeProvider.getCompletions('calc');
        }
        break;

      case '/theme':
        if (parts.length === 1 || parts[1] === 'calc' || (parts.length === 2 && !command.endsWith(' '))) {
          return this.themeProvider.getCompletions(parts.slice(1).join(' '));
        }
        break;

      case '/compare':
      case '/m':
        if (parts.length === 2) {
          // Show type suggestions after first space
          return [
            { value: 'driver', description: 'Compare driver statistics' },
            { value: 'team', description: 'Compare constructor statistics' }
          ].filter(s => s.value.startsWith(lastPart));
        }
        if (parts[1] === 'driver' && (parts.length === 3 || !command.endsWith(' '))) {
          // Show first driver suggestions
          return this.driverProvider.getCompletions(lastPart, parts);
        }
        if (parts[1] === 'team' && (parts.length === 3 || !command.endsWith(' '))) {
          // Show first team suggestions
          return this.teamProvider.getCompletions(lastPart, parts);
        }
        if (parts[1] === 'driver' && parts.length === 4) {
          // Show second driver suggestions
          return this.driverProvider.getCompletions(lastPart, parts);
        }
        if (parts[1] === 'team' && parts.length === 4) {
          // Show second team suggestions
          return this.teamProvider.getCompletions(lastPart, parts);
        }
        break;
    }

    return [];
  }
}