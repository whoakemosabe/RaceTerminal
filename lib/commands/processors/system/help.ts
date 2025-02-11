import { commands } from '@/lib/commands';
import { CommandFunction } from '../index';
import { commandAliases } from '@/components/terminal/command-processor';
import { commandInfo } from '@/lib/data/command-info';

// Helper functions
function formatCommand(cmd: typeof commands[0]): string {
  const [baseCmd, ...params] = cmd.command.split(' ');
  const aliases = baseCmd.match(/\((.*?)\)/)?.[1];
  const cleanCmd = baseCmd.replace(/\s*\(.*?\)/, '');
  const shortcut = Object.entries(commandAliases)
    .find(([alias, target]) => target === cleanCmd)?.[0];
  
  return [
    `${cleanCmd}${params.length ? ' ' + params.join(' ') : ''}`,
    aliases || shortcut ? `Aliases: ${[aliases, shortcut].filter(Boolean).join(', ')}` : '',
    `Description: ${cmd.description}`,
    `Source: ${cmd.source}`,
    ''
  ].filter(Boolean).join('\n');
}

function getCommandExamples(cmd: string): string {
  return commandExamples[cmd]?.join('\n') || '';
}

function getCommandNotes(cmd: string): string {
  return commandNotes[cmd]?.join('\n') || '';
}

function getRelatedCommands(cmd: string): string {
  return relatedCommands[cmd]?.join('\n') || '';
}

interface HelpCommands {
  [key: string]: CommandFunction;
}

// Help categories for organizing commands
const helpCategories = {
  'RACE INFORMATION': {
    description: 'Commands for accessing race data, standings, and schedules',
    commands: ['standings', 'teams', 'schedule', 'next', 'last', 'track', 'car']
  },
  'LIVE DATA': {
    description: 'Real-time data during active F1 sessions',
    commands: ['live', 'telemetry', 'status', 'weather', 'tires']
  },
  'HISTORICAL DATA': {
    description: 'Historical race results and statistics',
    commands: ['race', 'qualifying', 'sprint', 'pitstops', 'fastest', 'laps']
  },
  'ANALYSIS': {
    description: 'Advanced race and performance analysis tools',
    commands: ['pace', 'gap', 'sector', 'overtake', 'plot', 'compare']
  },
  'EFFECTS': {
    description: 'Visual effects and terminal customization',
    commands: ['retro', 'matrix', 'crt', 'glitch', 'scanlines', 'calc']
  },
  'SYSTEM': {
    description: 'System commands and terminal management',
    commands: ['user', 'clear', 'help', 'theme', 'sys', 'hack', 'fontsize', 'stats', 'decrypt']
  }
};

// Detailed command examples
const commandExamples: Record<string, string[]> = {
  '/driver': [
    '/driver hamilton - View Lewis Hamilton\'s profile',
    '/driver VER - View Max Verstappen using driver code',
    '/driver 1 - View driver using race number',
    '/driver schumi - View Michael Schumacher\'s profile'
  ],
  '/theme': [
    '/theme ferrari - Apply Ferrari team colors',
    '/theme dracula - Use Dracula editor theme',
    '/theme calc amber - Enable calculator mode with amber display',
    '/theme default - Reset to default colors'
  ],
  '/pace': [
    '/pace 2023 1 - Analyze race pace from 2023 Bahrain GP',
    '/pace 2023 5 - Analyze race pace from 2023 Miami GP',
    '/pace 2024 1 - Analyze race pace from 2024 Bahrain GP'
  ],
  '/gap': [
    '/gap 2023 1 - Analyze gaps from 2023 Bahrain GP',
    '/gap 2023 5 - Analyze gaps from 2023 Miami GP',
    '/gap 2024 1 - Analyze gaps from 2024 Bahrain GP'
  ],
  '/sector': [
    '/sector 2023 1 - Analyze sector times from 2023 Bahrain GP',
    '/sector 2023 5 - Analyze sector times from 2023 Miami GP',
    '/sector 2024 1 - Analyze sector times from 2024 Bahrain GP'
  ],
  '/overtake': [
    '/overtake 2023 1 - Analyze overtakes from 2023 Bahrain GP',
    '/overtake 2023 5 - Analyze overtakes from 2023 Miami GP',
    '/overtake 2024 1 - Analyze overtakes from 2024 Bahrain GP'
  ],
  '/plot': [
    '/plot 2023 1 verstappen - Plot Verstappen\'s lap times from 2023 Bahrain GP',
    '/plot 2023 5 leclerc - Plot Leclerc\'s lap times from 2023 Miami GP',
    '/plot 2024 1 hamilton - Plot Hamilton\'s lap times from 2024 Bahrain GP'
  ],
  '/compare': [
    '/compare driver verstappen hamilton - Compare Verstappen and Hamilton\'s careers',
    '/compare team redbull mercedes - Compare Red Bull and Mercedes statistics',
    '/md verstappen hamilton - Quick driver comparison shortcut',
    '/mt redbull mercedes - Quick team comparison shortcut'
  ],
  '/theme': [
    '/theme ferrari - Apply Ferrari team colors',
    '/theme dracula - Use Dracula editor theme',
    '/theme calc amber - Enable calculator mode with amber display',
    '/theme default - Reset to default colors'
  ],
  '/retro': [
    '/retro - Toggle retro text effect',
    '/retro all - Enable all retro effects',
    '/retro reset - Disable all effects'
  ]
};

// Command usage notes
const commandNotes: Record<string, string[]> = {
  '/driver': [
    '• Search by full name (e.g., hamilton)',
    '• Search by driver code (e.g., HAM)',
    '• Search by race number (e.g., 44)',
    '• Search by nickname (e.g., schumi)',
    '• Includes current and historical drivers',
    '• Shows nationality and career info',
    '• Case-insensitive search'
  ],
  '/theme': [
    '• Supports F1 team themes (e.g., ferrari, mercedes)',
    '• Editor themes (e.g., dracula, monokai, nord)',
    '• Calculator themes (use /theme calc <scheme>)',
    '• Themes persist between sessions',
    '• Use /theme default to reset colors'
  ],
  '/pace': [
    '• Analyzes race pace and consistency',
    '• Shows stint performance',
    '• Calculates tire degradation',
    '• Provides performance ratings',
    '• Available for all races since 2018'
  ],
  '/gap': [
    '• Shows intervals between drivers',
    '• Tracks gap to leader',
    '• Identifies key battles',
    '• Analyzes defensive performance',
    '• Includes DRS detection'
  ],
  '/sector': [
    '• Compares sector times',
    '• Shows theoretical best lap',
    '• Highlights purple/green sectors',
    '• Tracks session improvements',
    '• Available for qualifying sessions'
  ],
  '/overtake': [
    '• Tracks position changes',
    '• Identifies DRS overtakes',
    '• Analyzes defensive performance',
    '• Shows key overtaking moments',
    '• Includes battle analysis'
  ],
  '/plot': [
    '• Generates ASCII charts',
    '• Shows lap time trends',
    '• Marks fastest laps',
    '• Includes performance deltas',
    '• Visual lap time comparison'
  ],
  '/compare': [
    '• Compare career statistics',
    '• Shows head-to-head records',
    '• Includes championship data',
    '• Performance metrics',
    '• Historical achievements'
  ]
};

// Related commands for each command
const relatedCommands: Record<string, string[]> = {
  '/driver': [
    '• /compare - Compare driver statistics',
    '• /standings - Championship standings',
    '• /list drivers - List all drivers',
    '• /telemetry - Live car data'
  ],
  '/theme': [
    '• /retro - Retro text effects',
    '• /matrix - Matrix effects',
    '• /crt - CRT monitor effects',
    '• /calc - Calculator mode'
  ],
  '/pace': [
    '• /gap - Race gap analysis',
    '• /sector - Sector time analysis',
    '• /plot - Lap time plots',
    '• /overtake - Overtaking analysis'
  ],
  '/gap': [
    '• /pace - Race pace analysis',
    '• /overtake - Overtaking analysis',
    '• /plot - Lap time plots',
    '• /sector - Sector analysis'
  ],
  '/sector': [
    '• /qualifying - Full qualifying results',
    '• /fastest - Fastest lap records',
    '• /plot - Lap time plots',
    '• /pace - Race pace analysis'
  ],
  '/overtake': [
    '• /gap - Race gap analysis',
    '• /pace - Race pace analysis',
    '• /plot - Lap time plots',
    '• /sector - Sector analysis'
  ],
  '/plot': [
    '• /pace - Race pace analysis',
    '• /gap - Race gap analysis',
    '• /sector - Sector time analysis',
    '• /overtake - Overtaking analysis'
  ],
  '/compare': [
    '• /driver - Driver information',
    '• /team - Team information',
    '• /standings - Championship standings',
    '• /stats - Usage statistics'
  ]
};

export const helpCommands: HelpCommands = {
  '/help': async (args: string[]) => {
    // If a specific command is provided
    if (args[0]) {
      const searchTerm = args[0].toLowerCase();
      const commandKey = `/${searchTerm.replace('/', '')}`;
      
      // Check for category help first
      const category = Object.entries(helpCategories).find(([name]) => 
        name.toLowerCase().includes(searchTerm)
      );

      if (category) {
        const [categoryName, categoryInfo] = category;
        const categoryCommands = commands.filter(cmd => 
          categoryInfo.commands.some(term => 
            cmd.command.toLowerCase().includes(term)
          )
        );

        return [
          `📚 ${categoryName} COMMANDS`,
          '═'.repeat(60),
          categoryInfo.description,
          '',
          ...categoryCommands.map(formatCommand)
        ].join('\n');
      }

      // Check for specific command help
      if (commandInfo[commandKey]) {
        const info = commandInfo[commandKey];
        const command = commands.find(cmd => 
          cmd.command.split(' ')[0].replace(/\s*\(.*?\)/, '').toLowerCase() === commandKey
        );

        if (command) {
          const [baseCmd, ...params] = command.command.split(' ');
          const shortcut = Object.entries(commandAliases)
            .find(([alias, target]) => target === baseCmd)?.[0];
          const aliases = baseCmd.match(/\((.*?)\)/)?.[1];
          const aliasText = aliases || shortcut ? ` (${[aliases, shortcut].filter(Boolean).join(', ')})` : '';

          return [
            `📚 ${baseCmd.toUpperCase()} COMMAND REFERENCE`,
            '═'.repeat(60),
            `\nDescription: ${command.description}`,
            `Description: ${info.description}`,
            `Category: ${info.category}`,
            `Source: ${command.source}`,
            '',
            'Usage:',
            `${baseCmd}${params.length ? ` ${params.join(' ')}` : ''}${aliasText}`,
            '',
            'Examples:',
            getCommandExamples(commandKey),
            '',
            'Notes:',
            getCommandNotes(commandKey),
            '',
            'Related Commands:',
            getRelatedCommands(commandKey)
          ].filter(Boolean).join('\n');
        }
      }

      // Check for category help
      const category = quickReferenceCategories.find(cat => 
        cat.title.toLowerCase().includes(searchTerm.replace('/', ''))
      );

      if (category) {
        const categoryCommands = commands.filter(cmd =>
          category.filter.some(term => cmd.command.toLowerCase().includes(term))
        );

        return [
          `📚 ${category.title} COMMANDS`,
          '═'.repeat(60),
          '',
          ...categoryCommands.map(formatCommand)
        ].join('\n');
      }

      return [
        `❌ Help topic "${args[0]}" not found. Try one of these:`,
        '',
        'Categories:',
        ...quickReferenceCategories.map(cat => `• ${cat.title}`),
        '',
        'Popular Commands:',
        '• telemetry - Car telemetry data',
        '• live - Live timing information',
        '• weather - Track conditions',
        '• compare - Compare drivers/teams',
        '• effects - Visual effects',
        '• list - Available data'
      ].join('\n');
    }

    const header = [
      '📚 RACETERMINAL PRO COMMAND REFERENCE',
      '═'.repeat(60),
      '\nWelcome to RaceTerminal Pro! This terminal provides comprehensive Formula 1 data access and analysis.',
      'Below is a complete list of available commands organized by category.',
      ''
    ];

    const content = Object.entries(commandInfo).map(([cmd, info]) => {
      const command = commands.find(c => c.command.split(' ')[0] === cmd);
      if (!command) return '';
      
      const shortcut = Object.entries(commandAliases)
        .find(([alias, target]) => target === cmd)?.[0];
      const aliases = command.command.match(/\((.*?)\)/)?.[1];
      const aliasText = aliases || shortcut ? ` (${[aliases, shortcut].filter(Boolean).join(', ')})` : '';

      return `${cmd}${aliasText}\n  ${info.description}\n`;
    }).filter(Boolean);

    return [
      ...header,
      '🏁 RACE INFORMATION',
      '═'.repeat(60),
      content.filter(cmd => cmd.includes('standings') || cmd.includes('schedule') || cmd.includes('track')).join('\n'),
      '\n',
      '📊 LIVE DATA',
      '═'.repeat(60),
      content.filter(cmd => cmd.includes('live') || cmd.includes('telemetry') || cmd.includes('weather')).join('\n'),
      '',
      '📈 ANALYSIS',
      '═'.repeat(60),
      content.filter(cmd => {
        const info = commandInfo[cmd.split('\n')[0].split(' ')[0].trim()];
        return info && info.category === 'ANALYSIS';
      }).join('\n'),
      '',
      '✨ EFFECTS',
      '═'.repeat(60),
      content.filter(cmd => {
        const info = commandInfo[cmd.split('\n')[0].split(' ')[0].trim()];
        return info && info.category === 'EFFECTS';
      }).join('\n'),
      '',
      '⚙️ SYSTEM',
      '═'.repeat(60),
      content.filter(cmd => {
        const info = commandInfo[cmd.split('\n')[0].split(' ')[0].trim()];
        return info && info.category === 'SYSTEM';
      }).join('\n'),
      '',
      'Tips:',
      '• Use /list <type> to see available data (drivers, teams, tracks, cars)',
      '• Use Tab for command completion',
      '• Commands are case-insensitive',
      '• Most commands have shortcuts (shown in parentheses)',
      '• Press Alt+Enter to toggle fullscreen mode',
      '• Press Ctrl+L to clear the terminal',
      '',
      'For detailed help on any command, type: /help <command>',
      'For example: /help pace'
    ].join('\n');
  }
};

export const helpCommands: HelpCommands = {
  '/help': async (args: string[]) => {
    // If a specific command is provided
    if (args[0]) {
      const searchTerm = args[0].toLowerCase();
      const commandKey = `/${searchTerm.replace('/', '')}`;
      
      // Check for category help first
      const category = Object.entries(helpCategories).find(([name]) => 
        name.toLowerCase().includes(searchTerm)
      );

      if (category) {
        const [categoryName, categoryInfo] = category;
        const categoryCommands = commands.filter(cmd => 
          categoryInfo.commands.some(term => 
            cmd.command.toLowerCase().includes(term)
          )
        );

        return [
          `📚 ${categoryName} COMMANDS`,
          '═'.repeat(60),
          categoryInfo.description,
          '',
          ...categoryCommands.map(formatCommand)
        ].join('\n');
      }

      // Check for specific command help
      if (commandInfo[commandKey]) {
        const info = commandInfo[commandKey];
        const command = commands.find(cmd => 
          cmd.command.split(' ')[0].replace(/\s*\(.*?\)/, '').toLowerCase() === commandKey
        );

        if (command) {
          const [baseCmd, ...params] = command.command.split(' ');
          const shortcut = Object.entries(commandAliases)
            .find(([alias, target]) => target === baseCmd)?.[0];
          const aliases = baseCmd.match(/\((.*?)\)/)?.[1];
          const aliasText = aliases || shortcut ? ` (${[aliases, shortcut].filter(Boolean).join(', ')})` : '';

          return [
            `📚 ${baseCmd.toUpperCase()} COMMAND REFERENCE`,
            '═'.repeat(60),
            `\nDescription: ${command.description}`,
            `Description: ${info.description}`,
            `Category: ${info.category}`,
            `Source: ${command.source}`,
            '',
            'Usage:',
            `${baseCmd}${params.length ? ` ${params.join(' ')}` : ''}${aliasText}`,
            '',
            'Examples:',
            getCommandExamples(commandKey),
            '',
            'Notes:',
            getCommandNotes(commandKey),
            '',
            'Related Commands:',
            getRelatedCommands(commandKey)
          ].filter(Boolean).join('\n');
        }
      }

      // Check for category help
      const category = quickReferenceCategories.find(cat => 
        cat.title.toLowerCase().includes(searchTerm.replace('/', ''))
      );

      if (category) {
        const categoryCommands = commands.filter(cmd =>
          category.filter.some(term => cmd.command.toLowerCase().includes(term))
        );

        return [
          `📚 ${category.title} COMMANDS`,
          '═'.repeat(60),
          '',
          ...categoryCommands.map(formatCommand)
        ].join('\n');
      }

      return [
        `❌ Help topic "${args[0]}" not found. Try one of these:`,
        '',
        'Categories:',
        ...quickReferenceCategories.map(cat => `• ${cat.title}`),
        '',
        'Popular Commands:',
        '• telemetry - Car telemetry data',
        '• live - Live timing information',
        '• weather - Track conditions',
        '• compare - Compare drivers/teams',
        '• effects - Visual effects',
        '• list - Available data'
      ].join('\n');
    }

    const header = [
      '📚 RACETERMINAL PRO COMMAND REFERENCE',
      '═'.repeat(60),
      '\nWelcome to RaceTerminal Pro! This terminal provides comprehensive Formula 1 data access and analysis.',
      'Below is a complete list of available commands organized by category.',
      ''
    ];

    const content = Object.entries(commandInfo).map(([cmd, info]) => {
      const command = commands.find(c => c.command.split(' ')[0] === cmd);
      if (!command) return '';
      
      const shortcut = Object.entries(commandAliases)
        .find(([alias, target]) => target === cmd)?.[0];
      const aliases = command.command.match(/\((.*?)\)/)?.[1];
      const aliasText = aliases || shortcut ? ` (${[aliases, shortcut].filter(Boolean).join(', ')})` : '';

      return `${cmd}${aliasText}\n  ${info.description}\n`;
    }).filter(Boolean);

    return [
      ...header,
      '🏁 RACE INFORMATION',
      '═'.repeat(60),
      content.filter(cmd => cmd.includes('standings') || cmd.includes('schedule') || cmd.includes('track')).join('\n'),
      '\n',
      '📊 LIVE DATA',
      '═'.repeat(60),
      content.filter(cmd => cmd.includes('live') || cmd.includes('telemetry') || cmd.includes('weather')).join('\n'),
      '',
      '📈 ANALYSIS',
      '═'.repeat(60),
      content.filter(cmd => {
        const info = commandInfo[cmd.split('\n')[0].split(' ')[0].trim()];
        return info && info.category === 'ANALYSIS';
      }).join('\n'),
      '',
      '✨ EFFECTS',
      '═'.repeat(60),
      content.filter(cmd => {
        const info = commandInfo[cmd.split('\n')[0].split(' ')[0].trim()];
        return info && info.category === 'EFFECTS';
      }).join('\n'),
      '',
      '⚙️ SYSTEM',
      '═'.repeat(60),
      content.filter(cmd => {
        const info = commandInfo[cmd.split('\n')[0].split(' ')[0].trim()];
        return info && info.category === 'SYSTEM';
      }).join('\n'),
      '',
      'Tips:',
      '• Use /list <type> to see available data (drivers, teams, tracks, cars)',
      '• Use Tab for command completion',
      '• Commands are case-insensitive',
      '• Most commands have shortcuts (shown in parentheses)',
      '• Press Alt+Enter to toggle fullscreen mode',
      '• Press Ctrl+L to clear the terminal',
      '',
      'For detailed help on any command, type: /help <command>',
      'For example: /help pace'
    ].join('\n');
  }
};