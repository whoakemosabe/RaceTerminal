import { Suggestion } from './base';
import { CommandSuggestionProvider } from './command';
import { DriverSuggestionProvider } from './driver';
import { TeamSuggestionProvider } from './team';
import { TrackSuggestionProvider } from './track';

export class SuggestionManager {
  private commandProvider = new CommandSuggestionProvider();
  private driverProvider = new DriverSuggestionProvider();
  private teamProvider = new TeamSuggestionProvider();
  private trackProvider = new TrackSuggestionProvider();

  getSuggestions(command: string): Suggestion[] {
    if (!command.startsWith('/')) return [];

    const parts = command.toLowerCase().split(' ');
    const firstPart = parts[0];
    const lastPart = parts[parts.length - 1];

    // Base command suggestions
    if (parts.length === 1) {
      return this.commandProvider.getCompletions(firstPart);
    }

    // Argument suggestions based on command
    switch (firstPart) {
      case '/driver':
      case '/d':
      case '/md':
        return this.driverProvider.getCompletions(lastPart, parts);

      case '/team':
      case '/tm':
      case '/mt':
        return this.teamProvider.getCompletions(lastPart, parts);

      case '/track':
      case '/t':
        return this.trackProvider.getCompletions(lastPart);

      case '/compare':
      case '/m':
        if (parts.length === 2) {
          return [
            { value: 'driver', description: 'Compare driver statistics' },
            { value: 'team', description: 'Compare constructor statistics' }
          ].filter(s => s.value.startsWith(lastPart));
        }
        if (parts[1] === 'driver') {
          return this.driverProvider.getCompletions(lastPart, parts);
        }
        if (parts[1] === 'team') {
          return this.teamProvider.getCompletions(lastPart, parts);
        }
        break;
    }

    return [];
  }
}