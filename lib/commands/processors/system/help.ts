import { commands } from '@/lib/commands';
import { CommandFunction } from '../index';
import { commandAliases } from '@/components/terminal/command-processor';
import { commandCategories, CommandExample } from '@/lib/data/quick-reference';
import { commandInfo } from '@/lib/data/command-info';

// Helper functions
function formatCommand(cmd: typeof commands[0]): string {
  const [baseCmd, ...params] = cmd.command.split(' ');
  const aliases = baseCmd.match(/\((.*?)\)/)?.[1];
  const cleanCmd = baseCmd.replace(/\s*\(.*?\)/, '');
  const shortcut = Object.entries(commandAliases)
    .find(([alias, target]) => target === cleanCmd)?.[0];
  
  const lines = [
    `${cleanCmd}${params.length ? ' ' + params.join(' ') : ''}`
  ];
  
  if (aliases || shortcut) {
    lines.push(`Aliases: ${[aliases, shortcut].filter(Boolean).join(', ')}`);
  }
  
  lines.push(`Description: ${cmd.description}`);
  lines.push(`Source: ${cmd.source}`);
  
  return lines.join('\n');
}

function getCommandExamples(cmd: string): string {
  return commandExamples[cmd]?.examples?.join('\n') || '';
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
    commands: ['standings', 'teams', 'schedule', 'next', 'last', 'track', 'car', 'race']
  },
  'LIVE DATA': {
    description: 'Real-time data during active F1 sessions',
    commands: ['live', 'telemetry', 'status', 'weather', 'tires']
  },
  'HISTORICAL DATA': {
    description: 'Historical race results and statistics',
    commands: ['qualifying', 'sprint', 'pitstops', 'fastest', 'laps', 'race']
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
const commandExamples: Record<string, CommandExample> = {
  '/race': {
    command: '/race <year> <round> (/r)',
    description: 'View historical Formula 1 race results with full classification, gaps, retirements, and race analysis',
    examples: [
      'Current Season:',
      '/race 2024 1 - View 2024 Bahrain GP results',
      '/race 2024 2 - View 2024 Saudi Arabian GP results',
      '/race 2024 3 - View 2024 Australian GP results',
      '',
      'Previous Season:',
      '/race 2023 1 - View 2023 Bahrain GP results',
      '/race 2023 5 - View 2023 Miami GP results',
      '/race 2023 22 - View 2023 Abu Dhabi GP results',
      '',
      'Historical Races:',
      '/race 2021 1 - View 2021 Bahrain GP results',
      '/race 1988 1 - View 1988 Brazilian GP results',
      '/race 1950 1 - View first F1 World Championship race'
    ]
  },
  '/driver': {
    command: '/driver <name> (/d)',
    description: 'View F1 driver details, stats, and career info',
    examples: [
      'Usage:',
      '• /driver <name> - Search by full name (e.g., hamilton)',
      '• /driver <code> - Search by driver code (e.g., HAM)',
      '• /driver <number> - Search by race number (e.g., 44)',
      '• /driver <nickname> - Search by nickname (e.g., schumi)'
    ]
  },
  '/team': {
    command: '/team <name>',
    description: 'View F1 team history, achievements, and details',
    examples: [
      'Usage:',
      '• /team <name> - Search by team name (e.g., ferrari)',
      '• /team <code> - Search by team code (e.g., FER)',
      '• /team <nickname> - Search by nickname (e.g., redbull)'
    ]
  },
  '/pace': {
    command: '/pace <year> <round>',
    description: 'Analyze race pace and performance',
    examples: [
      'Usage:',
      '• /pace <year> <round> - Analyze race pace (e.g., /pace 2024 1)'
    ]
  },
  '/gap': {
    command: '/gap <year> <round>',
    description: 'Analyze race gaps and intervals',
    examples: [
      'Usage:',
      '• /gap <year> <round> - Analyze race gaps (e.g., /gap 2024 1)'
    ]
  },
  '/sector': {
    command: '/sector <year> <round>',
    description: 'Analyze qualifying sector times',
    examples: [
      'Usage:',
      '• /sector <year> <round> - Analyze sector times (e.g., /sector 2024 1)'
    ]
  },
  '/overtake': {
    command: '/overtake <year> <round>',
    description: 'Analyze race overtaking statistics',
    examples: [
      'Usage:',
      '• /overtake <year> <round> - Analyze overtakes (e.g., /overtake 2024 1)'
    ]
  },
  '/plot': {
    command: '/plot <year> <round> <driver>',
    description: 'Generate lap time progression chart',
    examples: [
      'Usage:',
      '• /plot <year> <round> <driver> - Plot lap times (e.g., /plot 2024 1 verstappen)'
    ]
  },
  '/compare': {
    command: '/compare <type> <name1> <name2>',
    description: 'Compare driver or team statistics',
    examples: [
      'Usage:',
      '• /compare driver <name1> <name2> - Compare drivers (e.g., /compare driver verstappen hamilton)',
      '• /compare team <name1> <name2> - Compare teams (e.g., /compare team redbull mercedes)',
      '• /md <name1> <name2> - Quick driver comparison',
      '• /mt <name1> <name2> - Quick team comparison'
    ]
  },
  '/theme': {
    command: '/theme <name>',
    description: 'Change terminal color theme',
    examples: [
      'Usage:',
      '• /theme <team> - Apply team colors (e.g., /theme ferrari)',
      '• /theme <editor> - Use editor theme (e.g., /theme dracula)',
      '• /theme calc <scheme> - Enable calculator mode (e.g., /theme calc amber)',
      '• /theme default - Reset colors'
    ]
  },
  '/retro': {
    command: '/retro [option]',
    description: 'Toggle retro terminal effects',
    examples: [
      'Usage:',
      '• /retro - Toggle retro text effect',
      '• /retro all - Enable all effects',
      '• /retro reset - Disable all effects'
    ]
  },
  '/qualifying': {
    command: '/qualifying <year> <round>',
    description: 'View qualifying session results',
    examples: [
      'Usage:',
      '• /qualifying <year> <round> - View qualifying results (e.g., /qualifying 2024 1)'
    ]
  },
  '/sprint': {
    command: '/sprint <year> <round>',
    description: 'View sprint race results',
    examples: [
      'Usage:',
      '• /sprint <year> <round> - View sprint results (e.g., /sprint 2024 1)'
    ]
  },
  '/pitstops': {
    command: '/pitstops <year> <round>',
    description: 'View pit stop timings and strategies',
    examples: [
      'Usage:',
      '• /pitstops <year> <round> - View pit stop data (e.g., /pitstops 2024 1)'
    ]
  },
  '/fastest': {
    command: '/fastest <year> <round>',
    description: 'View fastest lap records',
    examples: [
      'Usage:',
      '• /fastest <year> <round> - View fastest laps (e.g., /fastest 2024 1)'
    ]
  },
  '/laps': {
    command: '/laps <year> <round> [driver]',
    description: 'View detailed lap time data',
    examples: [
      'Usage:',
      '• /laps <year> <round> - View all lap times (e.g., /laps 2024 1)',
      '• /laps <year> <round> <driver> - View specific driver\'s laps (e.g., /laps 2024 1 verstappen)'
    ]
  }
};

// Command usage notes
const commandNotes: Record<string, string[]> = {
  '/driver': [
    'Search Options:',
    '• Search by full name (e.g., hamilton)',
    '• Search by driver code (e.g., HAM)',
    '• Search by race number (e.g., 44)',
    '• Search by nickname (e.g., schumi)',
    '',
    'Available Data:',
    '• Includes current and historical drivers',
    '• Current F1 drivers with teams',
    '• World Champions with years',
    '• Notable drivers from F1 history',
    '',
    'Driver Information:',
    '• Full name and nationality',
    '• Driver number and code',
    '• Team affiliation',
    '• Career achievements',
    '• Championship history',
    '',
    'Features:',
    '• Case-insensitive search',
    '• Fuzzy matching for nicknames',
    '• National flag display',
    '• Team color coding'
  ],
  '/team': [
    'Search Options:',
    '• Search by full name (e.g., ferrari)',
    '• Search by code (e.g., FER)',
    '• Search by nickname (e.g., redbull)',
    '',
    'Available Data:',
    '• All current F1 teams',
    '• Team headquarters location',
    '• Year established',
    '• Championship history',
    '• Technical details',
    '',
    'Team Information:',
    '• Official team name',
    '• Team principal',
    '• Power unit supplier',
    '• Notable achievements',
    '• Historical records',
    '',
    'Features:',
    '• Case-insensitive search',
    '• Team color coding',
    '• National flag display',
    '• Comprehensive statistics'
  ],
  '/theme': [
    'F1 Team Themes:',
    '• All current F1 teams supported (e.g., ferrari, mercedes, redbull)',
    '• Team colors match official branding',
    '• Includes primary and accent colors',
    '',
    'Editor Themes:',
    '• Popular editor themes (dracula, monokai, nord, etc.)',
    '• Full terminal color scheme customization',
    '• Optimized for readability',
    '',
    'Calculator Themes:',
    '• Classic green LCD display',
    '• Blue, amber, red, and white variants',
    '• Retro calculator aesthetics',
    '',
    'Additional Features:',
    '• Themes persist between sessions',
    '• Real-time color updates',
    '• Compatible with all terminal effects',
    '• Use /theme default to reset colors',
    '',
    'Tip: Use /list themes to see all available themes with previews'
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
  ],
  '/standings': [
    'Available Data:',
    '• Current season standings',
    '• Points totals',
    '• Position changes',
    '• Race wins',
    '• Podium finishes',
    '',
    'Features:',
    '• Live updates during races',
    '• Historical comparisons',
    '• Team color coding',
    '• National flags'
  ],
  '/teams': [
    'Available Data:',
    '• Constructor standings',
    '• Points totals',
    '• Development progress',
    '• Technical updates',
    '',
    'Features:',
    '• Live updates',
    '• Performance trends',
    '• Team comparisons',
    '• Historical records'
  ],
  '/schedule': [
    'Available Data:',
    '• Full season calendar',
    '• Race start times',
    '• Sprint events',
    '• Testing sessions',
    '',
    'Features:',
    '• Local time conversion',
    '• Track information',
    '• Weather forecasts',
    '• Historical results'
  ],
  '/next': [
    'Available Data:',
    '• Next race details',
    '• Countdown timer',
    '• Track information',
    '• Weather forecast',
    '',
    'Features:',
    '• Real-time updates',
    '• Circuit details',
    '• Previous results',
    '• Session schedule'
  ],
  '/last': [
    'Available Data:',
    '• Race results',
    '• Lap times',
    '• Pit stops',
    '• Key moments',
    '',
    'Features:',
    '• Detailed analysis',
    '• Performance metrics',
    '• Team comparisons',
    '• Driver battles'
  ],
  '/live': [
    'Available Data:',
    '• Real-time positions',
    '• Sector times',
    '• Speed traps',
    '• Tire information',
    '',
    'Features:',
    '• Live updates',
    '• Gap calculations',
    '• DRS detection',
    '• Battle tracking'
  ],
  '/telemetry': [
    'Available Data:',
    '• Throttle position',
    '• Brake usage',
    '• Gear selection',
    '• Engine RPM',
    '• Speed data',
    '',
    'Features:',
    '• Real-time updates',
    '• Driver comparison',
    '• Performance analysis',
    '• Energy deployment'
  ],
  '/weather': [
    'Available Data:',
    '• Air temperature',
    '• Track temperature',
    '• Wind speed/direction',
    '• Precipitation chance',
    '• Humidity levels',
    '',
    'Features:',
    '• Real-time updates',
    '• Forecast tracking',
    '• Track conditions',
    '• Weather radar'
  ],
  '/qualifying': [
    'Available Data:',
    '• Q1, Q2, Q3 session times',
    '• Sector times',
    '• Speed trap data',
    '• Track evolution',
    '• Elimination order',
    '',
    'Features:',
    '• Purple/green sector highlighting',
    '• Theoretical best laps',
    '• Mini sector analysis',
    '• Gap to pole position',
    '• Session progression',
    '',
    'Additional Information:',
    '• Track conditions',
    '• Tire compounds used',
    '• Traffic analysis',
    '• Out/in lap times',
    '• Sector improvements'
  ],
  '/sprint': [
    'Available Data:',
    '• Sprint race results',
    '• Grid positions',
    '• Finishing positions',
    '• Points scored',
    '• Race duration',
    '',
    'Features:',
    '• Position changes',
    '• Lap time analysis',
    '• Sprint shootout results',
    '• Performance metrics',
    '• Battle highlights',
    '',
    'Additional Information:',
    '• Weather conditions',
    '• Tire strategies',
    '• Team performance',
    '• Sprint format details',
    '• Championship impact'
  ],
  '/pitstops': [
    'Available Data:',
    '• Stop duration',
    '• Lap numbers',
    '• Tire compounds',
    '• Position changes',
    '• Total pit time',
    '',
    'Features:',
    '• Team performance',
    '• Strategy analysis',
    '• Undercut/overcut',
    '• Stack timing',
    '• Position impact',
    '',
    'Additional Information:',
    '• Pit crew stats',
    '• Stop sequence',
    '• Track position',
    '• Race situation',
    '• Safety car impact'
  ],
  '/fastest': [
    'Available Data:',
    '• Fastest lap time',
    '• Sector times',
    '• Speed traps',
    '• Lap number',
    '• Tire compound',
    '',
    'Features:',
    '• Lap evolution',
    '• Track conditions',
    '• Fuel load effect',
    '• DRS usage',
    '• Tire performance',
    '',
    'Additional Information:',
    '• Weather impact',
    '• Track temperature',
    '• Car setup',
    '• Race situation',
    '• Points impact'
  ],
  '/laps': [
    'Available Data:',
    '• Lap times',
    '• Sector times',
    '• Position changes',
    '• Gap to leader',
    '• Interval to next',
    '',
    'Features:',
    '• Stint analysis',
    '• Tire degradation',
    '• Fuel correction',
    '• Traffic impact',
    '• Battle tracking',
    '',
    'Additional Information:',
    '• Weather changes',
    '• Track evolution',
    '• Safety car periods',
    '• DRS trains',
    '• Strategy impact'
  ],
  '/race': [
    'Available Data:',
    '• Full race classification',
    '• Finishing positions',
    '• Time gaps/intervals',
    '• Laps completed',
    '• Retirements/DNFs',
    '',
    'Features:',
    '• Historical data since 1950',
    '• Team color coding',
    '• National flags',
    '• Status information',
    '• Points scored',
    '',
    'Additional Information:',
    '• Race duration',
    '• Grid positions',
    '• Position changes',
    '• Fastest laps',
    '• Championship impact'
  ]
};

// Related commands for each command
const relatedCommands: Record<string, string[]> = {
  '/driver': [
    '• /list drivers - List all available drivers',
    '• /compare - Compare driver statistics',
    '• /standings - Championship standings',
    '• /telemetry - Live car data',
    '• /team - View team information'
  ],
  '/team': [
    '• /list teams - List all available teams',
    '• /compare team - Compare team statistics',
    '• /teams - View constructor standings',
    '• /car - View car specifications',
    '• /theme - Apply team colors'
  ],
  '/theme': [
    '• /list themes - Show all available themes',
    '• /retro - Toggle retro text effects',
    '• /matrix - Toggle Matrix effects',
    '• /crt - Toggle CRT monitor effects',
    '• /calc - Toggle calculator mode',
    '• /scanlines - Toggle scanline effect'
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
  ],
  '/standings': [
    '• /teams - Constructor standings',
    '• /driver - Driver information',
    '• /compare - Compare statistics',
    '• /last - Recent race results',
    '• /schedule - Season calendar'
  ],
  '/teams': [
    '• /standings - Driver standings',
    '• /compare team - Team comparisons',
    '• /car - Car specifications',
    '• /theme - Team colors',
    '• /telemetry - Car performance'
  ],
  '/schedule': [
    '• /next - Next race details',
    '• /track - Circuit information',
    '• /weather - Track conditions',
    '• /last - Previous results',
    '• /live - Session timing'
  ],
  '/next': [
    '• /schedule - Full calendar',
    '• /weather - Track forecast',
    '• /track - Circuit details',
    '• /live - Session timing',
    '• /telemetry - Car data'
  ],
  '/last': [
    '• /race - Historical results',
    '• /pace - Race analysis',
    '• /gap - Interval analysis',
    '• /overtake - Battle analysis',
    '• /plot - Lap time charts'
  ],
  '/live': [
    '• /telemetry - Car data',
    '• /weather - Track conditions',
    '• /status - Session status',
    '• /tires - Compound tracking',
    '• /gap - Interval analysis'
  ],
  '/telemetry': [
    '• /live - Session timing',
    '• /tires - Tire performance',
    '• /weather - Track conditions',
    '• /status - Session status',
    '• /car - Technical specs'
  ],
  '/weather': [
    '• /track - Circuit details',
    '• /live - Session timing',
    '• /telemetry - Car performance',
    '• /tires - Compound choice',
    '• /status - Track conditions'
  ],
  '/qualifying': [
    '• /sector - Detailed sector analysis',
    '• /fastest - Fastest lap records',
    '• /plot - Lap time progression',
    '• /weather - Track conditions',
    '• /telemetry - Car performance'
  ],
  '/sprint': [
    '• /race - Full race results',
    '• /pace - Performance analysis',
    '• /gap - Interval tracking',
    '• /overtake - Battle analysis',
    '• /plot - Lap time charts'
  ],
  '/pitstops': [
    '• /race - Full race results',
    '• /pace - Stint analysis',
    '• /gap - Position changes',
    '• /laps - Lap time impact',
    '• /plot - Strategy visualization'
  ],
  '/fastest': [
    '• /qualifying - Session results',
    '• /sector - Sector analysis',
    '• /telemetry - Car data',
    '• /weather - Track conditions',
    '• /plot - Lap time charts'
  ],
  '/laps': [
    '• /pace - Race analysis',
    '• /gap - Interval tracking',
    '• /plot - Time progression',
    '• /pitstops - Strategy impact',
    '• /overtake - Position changes'
  ],
  '/race': [
    '• /qualifying - Session results',
    '• /sprint - Sprint race results',
    '• /pitstops - Pit stop analysis',
    '• /fastest - Fastest lap data',
    '• /laps - Detailed lap times'
  ]
};

export const helpCommands: HelpCommands = {
  '/help': async (args: string[]) => {
    // If a specific command is provided
    if (args[0]) {
      // Show specific command help
      return showCommandHelp(args[0]);
    }

    // Show main help page
    return [
      '📚 RACETERMINAL PRO HELP',
      '═'.repeat(60),
      '',
      'Welcome to RaceTerminal Pro!',
      'Your advanced Formula 1 data companion.',
      '',
      ...commandCategories.map(category => [
        category.title,
        '─'.repeat(40),
        category.description,
        '',
        ...commands
          .filter(cmd => category.filter.some(term => 
            cmd.command.toLowerCase().includes(term) ||
            (cmd.category?.toLowerCase() === category.title.toLowerCase()) ||
            (term === 'sa' && cmd.command.includes('/sector')) ||
            (term === 'oa' && cmd.command.includes('/overtake')) ||
            (term === 'ov' && cmd.command.includes('/overtake')) ||
            (term === 'md' && cmd.command.includes('/compare driver')) ||
            (term === 'mt' && cmd.command.includes('/compare team'))
          ))
          .map(cmd => {
            const [baseCmd, ...params] = cmd.command.split(' ');
            const shortcut = Object.entries(commandAliases)
              .find(([alias, target]) => target === baseCmd.replace(/\s*\(.*?\)/, ''))?.[0];
            const aliasText = shortcut ? ` (${shortcut})` : '';
            return `  ${baseCmd}${params.length ? ` ${params.join(' ')}` : ''}${aliasText}\n    ${cmd.description}`;
          }),
        ''
      ]).flat(),
      'KEYBOARD SHORTCUTS',
      '─'.repeat(40),
      '  Alt + Enter  Fullscreen mode',
      '  Tab          Command completion',
      '  ↑/↓          Command history',
      '  Ctrl + L     Clear terminal',
      '  Ctrl + C     Cancel command',
      '  Esc          Close/cancel',
      '',
      'TIPS',
      '─'.repeat(40),
      '  • Type /help <command> for detailed help on any command',
      '  • Use /list to see available data (drivers, teams, tracks)',
      '  • Commands are case-insensitive',
      '  • Most commands have shortcuts (shown in parentheses)',
      '  • Tab completion is available for most commands',
      '  • Press Alt+Enter to toggle fullscreen mode'
    ].join('\n');
  }
};

function showCommandHelp(command: string): string {
  const searchTerm = command.toLowerCase();
  const cleanSearchTerm = searchTerm.startsWith('/') ? searchTerm.slice(1) : searchTerm;
  const commandKey = `/${cleanSearchTerm}`;
  
  // Special handling for driver help
  if (cleanSearchTerm === 'driver') {
    return [
      '📚 COMMAND HELP: /driver (/d)',
      '═'.repeat(60),
      '',
      'DESCRIPTION',
      'View detailed Formula 1 driver information including career statistics, achievements, and current status.',
      '',
      'USAGE',
      '/driver <name> (/d)',
      '',
      'SEARCH OPTIONS',
      '• Full name (e.g., hamilton)',
      '• Driver code (e.g., HAM)',
      '• Race number (e.g., 44)',
      '• Nickname (e.g., schumi)',
      '',
      'EXAMPLES',
      'Current Drivers:',
      '/driver hamilton - View Lewis Hamilton\'s profile',
      '/driver VER - View Max Verstappen using driver code',
      '/driver 1 - View driver using race number',
      '/driver checo - View Sergio Perez using nickname',
      '',
      'World Champions:',
      '/driver senna - View Ayrton Senna\'s profile',
      '/driver schumi - View Michael Schumacher\'s profile',
      '/driver prost - View Alain Prost\'s profile',
      '',
      'Notable Drivers:',
      '/driver moss - View Stirling Moss\'s profile',
      '/driver villeneuve - View Gilles Villeneuve\'s profile',
      '/driver montoya - View Juan Pablo Montoya\'s profile',
      '',
      'NOTES',
      'Search Options:',
      '• Search by full name (e.g., hamilton)',
      '• Search by driver code (e.g., HAM)',
      '• Search by race number (e.g., 44)',
      '• Search by nickname (e.g., schumi)',
      '',
      'Available Data:',
      '• Includes current and historical drivers',
      '• Current F1 drivers with teams',
      '• World Champions with years',
      '• Notable drivers from F1 history',
      '',
      'Driver Information:',
      '• Full name and nationality',
      '• Driver number and code',
      '• Team affiliation',
      '• Career achievements',
      '• Championship history',
      '',
      'Features:',
      '• Case-insensitive search',
      '• Fuzzy matching for nicknames',
      '• National flag display',
      '• Team color coding',
      '',
      'RELATED COMMANDS',
      '• /list drivers - List all available drivers',
      '• /compare - Compare driver statistics',
      '• /standings - Championship standings',
      '• /telemetry - Live car data',
      '• /team - View team information'
    ].join('\n');
  }
  
  // Handle command aliases
  const aliasedCommand = commandAliases[commandKey];
  const effectiveCommand = aliasedCommand ? `/${aliasedCommand.split(' ')[0]}` : commandKey;
  
  // Check for specific command help
  const info = commandInfo[effectiveCommand] || commandInfo[commandKey];
  const cmd = commands.find(c => {
    const cmdBase = c.command.split(' ')[0].replace(/\s*\(.*?\)/, '');
    return cmdBase.toLowerCase() === effectiveCommand.toLowerCase() || 
           cmdBase.toLowerCase() === commandKey.toLowerCase() ||
           cmdBase.toLowerCase() === cleanSearchTerm.toLowerCase();
  });

  if (cmd && info) {
    const [baseCmd, ...params] = cmd.command.split(' ');
    const shortcut = Object.entries(commandAliases)
      .find(([alias, target]) => target === baseCmd)?.[0];
    const aliases = baseCmd.match(/\((.*?)\)/)?.[1];
    const aliasText = aliases || shortcut ? ` (${[aliases, shortcut].filter(Boolean).join(', ')})` : '';

    return [
      `📚 COMMAND HELP: ${baseCmd}${aliasText}`,
      '═'.repeat(60),
      '',
      'DESCRIPTION',
      info.description,
      '',
      'USAGE',
      ...commandExamples[effectiveCommand]?.examples || [],
      '',
      'NOTES',
      ...(commandNotes[effectiveCommand] || commandNotes[commandKey] || []),
      '',
      'RELATED COMMANDS',
      ...(relatedCommands[effectiveCommand] || relatedCommands[commandKey] || [])
    ].filter(Boolean).join('\n');
  }

  // Check for category help
  const matchedCategory = commandCategories.find(cat => 
    cat.title.toLowerCase().includes(cleanSearchTerm)
  );

  if (matchedCategory) {
    return [
      `📚 ${matchedCategory.title} COMMANDS`,
      '═'.repeat(60),
      '',
      matchedCategory.description,
      '',
      'AVAILABLE COMMANDS',
      ...commands
        .filter(cmd => matchedCategory.filter.some(term => cmd.command.toLowerCase().includes(term)))
        .map(cmd => {
          const [baseCmd, ...params] = cmd.command.split(' ');
          const shortcut = Object.entries(commandAliases)
            .find(([alias, target]) => target === baseCmd)?.[0];
          const aliasText = shortcut ? ` (${shortcut})` : '';
          return `• ${baseCmd}${params.length ? ` ${params.join(' ')}` : ''}${aliasText}\n  ${cmd.description}`;
        }),
      '',
      'NOTES',
      '• All commands support tab completion',
      '• Commands are case-insensitive',
      '• Use /help <command> for detailed help',
    ].join('\n');
  }
  
  return [
    '❌ Help topic not found',
    '',
    'Try one of these categories:',
    ...commandCategories.map(cat => `• ${cat.title.toLowerCase()} - ${cat.description}`),
    '',
    'Or type /help for the main help page'
  ].join('\n');
}