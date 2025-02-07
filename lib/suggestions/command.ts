import { commands } from '@/lib/commands';
import { commandAliases } from '@/components/terminal/command-processor';
import { Suggestion, SuggestionProvider, deduplicate } from './base';

export class CommandSuggestionProvider implements SuggestionProvider {
  getCompletions(input: string): Suggestion[] {
    const suggestions: Suggestion[] = [];
    
    // Add base commands with their attributes
    commands.forEach(c => {
      const [baseCmd, ...attrs] = c.command.split(' ');
      if (baseCmd.startsWith(input)) {
        suggestions.push({
          value: baseCmd,
          description: c.description,
          ...(attrs.length > 0 && { description: `${attrs.join(' ')} (${c.description})` })
        });
      }
    });
    
    // Add aliases with their mapped commands
    Object.entries(commandAliases).forEach(([alias, target]) => {
      if (alias.startsWith(input)) {
        const targetCmd = commands.find(c => c.command.startsWith(target.split(' ')[0]));
        if (targetCmd) {
          suggestions.push({
            value: alias,
            description: targetCmd.description,
            alias: target
          });
        }
      }
    });
    
    return deduplicate(suggestions);
  }
}