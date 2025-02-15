import { userCommands } from './user';
import { themeCommands } from './theme';
import { helpCommands } from './help';
import { effectsCommands } from './effects';
import { systemInfoCommands } from './system-info';
import { CommandFunction } from '../index';

interface SystemCommands {
  [key: string]: CommandFunction;
}

// Combine all system-related commands
export const systemCommands: SystemCommands = {
  ...userCommands,
  ...themeCommands,
  ...helpCommands,
  ...effectsCommands,
  ...systemInfoCommands,
  '/stats': async () => {
    try {
      // Get command history from localStorage
      const history = localStorage.getItem('commandHistory');
      if (!history) {
        return [
          '📊 TERMINAL USAGE STATISTICS',
          '═'.repeat(50),
          '',
          '❌ No command history available yet.',
          '',
          'Start using commands to build up statistics:',
          '• Try /driver hamilton',
          '• Try /standings',
          '• Try /next',
          '',
          'Type /help to see all available commands.'
        ].join('\n');
      }

      const parsedHistory = JSON.parse(history);
      if (!Array.isArray(parsedHistory) || parsedHistory.length === 0) {
        return [
          '📊 TERMINAL USAGE STATISTICS',
          '═'.repeat(50),
          '',
          '❌ No valid command history found.',
          '',
          'Start using commands to build up statistics:',
          '• Try /driver hamilton',
          '• Try /standings',
          '• Try /next',
          '',
          'Type /help to see all available commands.'
        ].join('\n');
      }

      // Get session start time
      const sessionStart = localStorage.getItem('session_start_time');
      const sessionStartTime = sessionStart ? 
        new Date(parseInt(sessionStart)).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) : 'Unknown';

      // Calculate statistics
      const stats = {
        totalCommands: parsedHistory.length,
        commandCounts: {} as Record<string, { count: number; lastUsed: string }>,
        sessionStart: sessionStartTime,
        lastCommand: parsedHistory[parsedHistory.length - 1].command,
        lastCommandTime: parsedHistory[parsedHistory.length - 1].timestamp || 'Unknown'
      };

      // Count command usage
      parsedHistory.forEach((entry: any) => {
        const baseCommand = entry.command.split(' ')[0].toLowerCase();
        if (!stats.commandCounts[baseCommand]) {
          stats.commandCounts[baseCommand] = {
            count: 0,
            lastUsed: entry.timestamp || 'Unknown'
          };
        }
        stats.commandCounts[baseCommand].count++;
        stats.commandCounts[baseCommand].lastUsed = entry.timestamp || 'Unknown';
      });

      // Sort commands by usage count
      const sortedCommands = Object.entries(stats.commandCounts)
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 10); // Top 10 commands

      // Calculate command frequency
      const sessionDuration = sessionStart ? 
        (Date.now() - parseInt(sessionStart)) / (1000 * 60) : // minutes
        0;
      const commandsPerMinute = sessionDuration > 0 ? 
        (stats.totalCommands / sessionDuration).toFixed(2) : 
        'N/A';

      // Calculate session duration in hours and minutes
      const hours = Math.floor(sessionDuration / 60);
      const minutes = Math.floor(sessionDuration % 60);
      const durationStr = hours > 0 ? 
        `${hours}h ${minutes}m` : 
        `${minutes}m`;
      // Format output
      return [
        '📊 TERMINAL USAGE STATISTICS',
        '═'.repeat(50),
        '',
        '🕒 Session Information',
        `• Session Start: ${stats.sessionStart}`,
        `• Duration: ${durationStr}`,
        `• Total Commands: ${stats.totalCommands} (${commandsPerMinute} per minute)`,
        `• Last Command: ${stats.lastCommand}`,
        `• Last Activity: ${stats.lastCommandTime}`,
        '',
        '📈 Most Used Commands',
        '═'.repeat(25),
        ...sortedCommands.map(([cmd, data], index) => 
          `${(index + 1).toString().padStart(2, ' ')}. ${cmd.padEnd(15)} ${data.count.toString().padStart(3)} uses | ${data.lastUsed}`
        ),
        '',
        '💡 Command Categories',
        '═'.repeat(25),
        `• Race Info: ${countCategoryCommands(parsedHistory, ['/driver', '/team', '/track', '/car'])}`,
        `• Live Data: ${countCategoryCommands(parsedHistory, ['/live', '/telemetry', '/weather', '/status'])}`,
        `• Analysis: ${countCategoryCommands(parsedHistory, ['/pace', '/gap', '/sector', '/overtake', '/plot'])}`,
        `• System: ${countCategoryCommands(parsedHistory, ['/theme', '/clear', '/help', '/user', '/stats'])}`,
        '',
        '🎯 Usage Tips',
        '• Use Tab for command completion',
        '• Try /help for detailed documentation',
        '• Explore /list to see available data'
      ].join('\n');

    } catch (error) {
      console.error('Error generating stats:', error);
      return '❌ Error: Could not generate usage statistics. Please try again later.';
    }
  }
};

function countCategoryCommands(history: any[], commands: string[]): string {
  const count = history.filter(entry => 
    commands.some(cmd => entry.command.toLowerCase().startsWith(cmd))
  ).length;
  return `${count} commands (${((count / history.length) * 100).toFixed(1)}%)`;
}