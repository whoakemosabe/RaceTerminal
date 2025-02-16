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

    // Split command and normalize
    const parts = command.toLowerCase().trim().split(/\s+/);
    const firstPart = parts[0];
    const isNewStage = command.endsWith(' ');
    const stage = isNewStage ? parts.length : parts.length - 1;
    const currentPart = isNewStage ? '' : parts[parts.length - 1];

    // Handle compare command and shortcuts
    if (firstPart === '/compare' || firstPart === '/m') {
      // First stage: show type options
      if (stage === 1) {
        return [
          { value: 'driver', description: 'Compare driver statistics' },
          { value: 'team', description: 'Compare constructor statistics' }
        ].filter(s => s.value.toLowerCase().startsWith(currentPart.toLowerCase()));
      }
      // Second stage: show first driver/team
      if (stage === 2 && parts[1] === 'driver') {
        return this.driverProvider.getCompletions(currentPart, parts);
      }
      if (stage === 2 && parts[1] === 'team') {
        return this.teamProvider.getCompletions(currentPart, parts);
      }
      // Third stage: show second driver/team
      if (stage === 3 && parts[1] === 'driver') {
        return this.driverProvider.getCompletions(currentPart, parts);
      }
      if (stage === 3 && parts[1] === 'team') {
        return this.teamProvider.getCompletions(currentPart, parts);
      }
    }

    // Handle compare shortcuts
    if (firstPart === '/md') {
      if (stage === 1) {
        return this.driverProvider.getCompletions(currentPart, parts);
      }
      if (stage === 2) {
        return this.driverProvider.getCompletions(currentPart, parts);
      }
    }
    if (firstPart === '/mt') {
      if (stage === 1) {
        return this.teamProvider.getCompletions(currentPart, parts);
      }
      if (stage === 2) {
        return this.teamProvider.getCompletions(currentPart, parts);
      }
    }

    // Base command suggestions
    if (stage === 0) {
      const suggestions = this.commandProvider.getCompletions(firstPart);
      return this.sortSuggestions(suggestions, firstPart);
    }

    // Argument suggestions based on command
    switch (firstPart) {
      case '/list':
      case '/ls':
        if (stage === 1) {
          return this.listProvider.getCompletions(currentPart);
        }
        break;

      case '/driver':
      case '/d':
        if (stage === 1) {
          return this.driverProvider.getCompletions(currentPart, parts);
        }
        break;

      case '/team':
      case '/tm':
        if (stage === 1) {
          return this.teamProvider.getCompletions(currentPart, parts);
        }
        break;

      case '/car':
      case '/c':
        if (stage === 1) {
          return this.carProvider.getCompletions(currentPart);
        }
        break;

      case '/track':
      case '/t':
        if (stage === 1) {
          return this.trackProvider.getCompletions(currentPart);
        }
        break;

      case '/theme':
        if (stage === 1) {
          return this.themeProvider.getCompletions(currentPart);
        }
        break;

    }

    return [];
  }

  private sortSuggestions(suggestions: Suggestion[], searchTerm: string): Suggestion[] {
    return suggestions.sort((a, b) => {
      const aStartsWith = a.value.toLowerCase().startsWith(searchTerm.toLowerCase());
      const bStartsWith = b.value.toLowerCase().startsWith(searchTerm.toLowerCase());
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return a.value.localeCompare(b.value);
    });
  }
}