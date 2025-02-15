import { commands } from '@/lib/commands';
import { CommandFunction } from '../index';
import { commandAliases } from '@/components/terminal/command-processor';
import { quickReferenceCategories } from '@/lib/data/quick-reference';
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
    '/driver montoya - View Juan Pablo Montoya\'s profile'
  ],
  '/team': [
    'Current Teams:',
    '/team redbull - View Red Bull Racing profile',
    '/team ferrari - View Scuderia Ferrari profile',
    '/team mercedes - View Mercedes-AMG Petronas profile',
    '',
    'Search Variations:',
    '/team rb - View Red Bull Racing (using nickname)',
    '/team amr - View Aston Martin (using code)',
    '/team mclaren - View McLaren F1 Team',
    '',
    'Detailed Information:',
    '/team alpine - View Alpine F1 Team details',
    '/team haas - View Haas F1 Team profile',
    '/team williams - View Williams Racing history'
  ],
  '/theme': [
    '/theme ferrari - Apply Ferrari team colors',
    '/theme dracula - Use Dracula editor theme',
    '/theme calc amber - Enable calculator mode with amber display',
    '/theme default - Reset to default colors',
    '/theme nord - Apply Nord editor theme',
    '/theme monokai - Apply Monokai editor theme'
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
  ],
  '/qualifying': [
    'Current Session:',
    '/qualifying 2024 1 - View 2024 Bahrain GP qualifying',
    '/qualifying 2024 2 - View 2024 Saudi Arabian GP qualifying',
    '/qualifying 2024 3 - View 2024 Australian GP qualifying',
    '',
    'Historical Sessions:',
    '/qualifying 2023 1 - View 2023 Bahrain GP qualifying',
    '/qualifying 2023 5 - View 2023 Miami GP qualifying',
    '/qualifying 2023 22 - View 2023 Abu Dhabi GP qualifying'
  ],
  '/sprint': [
    'Current Season:',
    '/sprint 2024 1 - View first sprint race of 2024',
    '/sprint 2024 2 - View second sprint race of 2024',
    '',
    'Previous Season:',
    '/sprint 2023 1 - View Azerbaijan GP sprint',
    '/sprint 2023 4 - View Belgian GP sprint',
    '/sprint 2023 6 - View Qatar GP sprint'
  ],
  '/pitstops': [
    'Current Season:',
    '/pitstops 2024 1 - View 2024 Bahrain GP pit stops',
    '/pitstops 2024 2 - View 2024 Saudi Arabian GP pit stops',
    '',
    'Previous Season:',
    '/pitstops 2023 1 - View 2023 Bahrain GP pit stops',
    '/pitstops 2023 5 - View 2023 Miami GP pit stops',
    '/pitstops 2023 22 - View 2023 Abu Dhabi GP pit stops'
  ],
  '/fastest': [
    'Current Season:',
    '/fastest 2024 1 - View 2024 Bahrain GP fastest laps',
    '/fastest 2024 2 - View 2024 Saudi Arabian GP fastest laps',
    '',
    'Previous Season:',
    '/fastest 2023 1 - View 2023 Bahrain GP fastest laps',
    '/fastest 2023 5 - View 2023 Miami GP fastest laps',
    '/fastest 2023 22 - View 2023 Abu Dhabi GP fastest laps'
  ],
  '/laps': [
    'Current Season:',
    '/laps 2024 1 - View 2024 Bahrain GP lap times',
    '/laps 2024 2 - View 2024 Saudi Arabian GP lap times',
    '',
    'Previous Season:',
    '/laps 2023 1 - View 2023 Bahrain GP lap times',
    '/laps 2023 5 - View 2023 Miami GP lap times',
    '/laps 2023 22 - View 2023 Abu Dhabi GP lap times'
  ]
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
  ]
};

export const helpCommands: HelpCommands = {
  '/help': async (args: string[]) => {
    // If a specific command is provided
    if (args[0]) {
      const searchTerm = args[0].toLowerCase();
      // Clean up search term and handle aliases
      const cleanSearchTerm = searchTerm.startsWith('/') ? searchTerm.slice(1) : searchTerm;
      const commandKey = `/${cleanSearchTerm}`;
      
      // Special handling for driver and team help
      if (cleanSearchTerm === 'driver') {
        return [
          'COMMAND REFERENCE: /DRIVER',
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
          ...commandExamples['/driver'],
          '',
          'NOTES',
          ...commandNotes['/driver'],
          '',
          'RELATED COMMANDS',
          ...relatedCommands['/driver']
        ].join('\n');
      }

      if (cleanSearchTerm === 'team') {
        return [
          'COMMAND REFERENCE: /TEAM',
          '═'.repeat(60),
          '',
          'DESCRIPTION',
          'View comprehensive Formula 1 team information including history, achievements, technical details, and current status.',
          '',
          'USAGE',
          '/team <name>',
          '',
          'SEARCH OPTIONS',
          '• Full name (e.g., ferrari)',
          '• Team code (e.g., FER)',
          '• Nickname (e.g., redbull)',
          '',
          'EXAMPLES',
          ...commandExamples['/team'],
          '',
          'NOTES',
          ...commandNotes['/team'],
          '',
          'RELATED COMMANDS',
          ...relatedCommands['/team']
        ].join('\n');
      }

      // Handle command aliases
      const aliasedCommand = commandAliases[commandKey];
      const effectiveCommand = aliasedCommand ? `/${aliasedCommand.split(' ')[0]}` : commandKey;
      
      // Check for category help first
      const matchedCategory = Object.entries(helpCategories).find(([name]) => 
        name.toLowerCase().includes(cleanSearchTerm)
      );

      if (matchedCategory) {
        const [categoryName, categoryInfo] = matchedCategory;
        return [
          `COMMAND REFERENCE: ${categoryName}`,
          '═'.repeat(60),
          '',
          'DESCRIPTION',
          categoryInfo.description,
          '',
          'AVAILABLE COMMANDS',
          ...commands
            .filter(cmd => categoryInfo.commands.some(term => cmd.command.toLowerCase().includes(term)))
            .map(cmd => {
              const [baseCmd, ...params] = cmd.command.split(' ');
              const shortcut = Object.entries(commandAliases)
                .find(([alias, target]) => target === baseCmd)?.[0];
              const aliasText = shortcut ? ` (${shortcut})` : '';
              return `• ${baseCmd}${params.length ? ` ${params.join(' ')}` : ''}${aliasText}\n  ${cmd.description}`;
            }),
          '',
          'NOTES',
          `• All commands support tab completion`,
          `• Commands are case-insensitive`,
          `• Use /help <command> for detailed help`,
          '',
          'RELATED CATEGORIES',
          ...Object.keys(helpCategories)
            .filter(cat => cat !== categoryName)
            .map(cat => `• ${cat.toLowerCase()} - ${helpCategories[cat as keyof typeof helpCategories].description}`)
        ].join('\n');
      }

      // Check for specific command help
      const info = commandInfo[effectiveCommand] || commandInfo[commandKey];
      const command = commands.find(cmd => {
        const cmdBase = cmd.command.split(' ')[0].replace(/\s*\(.*?\)/, '').toLowerCase();
        return cmdBase === effectiveCommand.toLowerCase() || 
               cmdBase === commandKey.toLowerCase() ||
               cmdBase === cleanSearchTerm.toLowerCase();
      });

      if (command && info) {
        const [baseCmd, ...params] = command.command.split(' ');
        const shortcut = Object.entries(commandAliases)
          .find(([alias, target]) => target === baseCmd)?.[0];
        const aliases = baseCmd.match(/\((.*?)\)/)?.[1];
        const aliasText = aliases || shortcut ? ` (${[aliases, shortcut].filter(Boolean).join(', ')})` : '';

        return [
          `COMMAND REFERENCE: ${baseCmd.toUpperCase()}`,
          '═'.repeat(60),
          '',
          'DESCRIPTION',
          info.description,
          '',
          'DETAILS',
          `Category: ${info.category}`,
          `Source: ${command.source}`,
          '',
          'USAGE',
          `${baseCmd}${params.length ? ` ${params.join(' ')}` : ''}${aliasText}`,
          '',
          'EXAMPLES',
          getCommandExamples(effectiveCommand) || getCommandExamples(commandKey) || '',
          '',
          'NOTES',
          getCommandNotes(effectiveCommand) || getCommandNotes(commandKey) || '',
          '',
          'RELATED COMMANDS',
          getRelatedCommands(effectiveCommand) || getRelatedCommands(commandKey) || ''
        ].filter(Boolean).join('\n');
      }

      // Check for category help
      const matchedQuickRef = quickReferenceCategories.find(cat => 
        cat.title.toLowerCase().includes(cleanSearchTerm)
      );

      if (matchedQuickRef) {
        const categoryCommands = commands.filter(cmd =>
          matchedQuickRef.filter.some(term => cmd.command.toLowerCase().includes(term))
        );

        return [
          `📚 ${matchedQuickRef.title} COMMANDS`,
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
      'RACETERMINAL PRO COMMAND REFERENCE',
      '═'.repeat(60),
      '',
      'Welcome to RaceTerminal Pro!',
      'This terminal provides comprehensive Formula 1 data access and analysis.',
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
      'RACE INFORMATION',
      '═'.repeat(60),
      content.filter(cmd => cmd.includes('standings') || cmd.includes('schedule') || cmd.includes('track')).join('\n'),
      '\n',
      'LIVE DATA',
      '═'.repeat(60),
      content.filter(cmd => cmd.includes('live') || cmd.includes('telemetry') || cmd.includes('weather')).join('\n'),
      '',
      'ANALYSIS',
      '═'.repeat(60),
      content.filter(cmd => {
        const info = commandInfo[cmd.split('\n')[0].split(' ')[0].trim()];
        return info && info.category === 'ANALYSIS';
      }).join('\n'),
      '',
      'EFFECTS',
      '═'.repeat(60),
      content.filter(cmd => {
        const info = commandInfo[cmd.split('\n')[0].split(' ')[0].trim()];
        return info && info.category === 'EFFECTS';
      }).join('\n'),
      '',
      'SYSTEM',
      '═'.repeat(60),
      content.filter(cmd => {
        const info = commandInfo[cmd.split('\n')[0].split(' ')[0].trim()];
        return info && info.category === 'SYSTEM';
      }).join('\n'),
      '',
      'TIPS',
      '═'.repeat(60),
      '• Use /list <type> to see available data (drivers, teams, tracks, cars)',
      '• Tab completion is available for most commands',
      '• Commands are case-insensitive',
      '• Most commands have shortcuts (shown in parentheses)',
      '• Press Alt+Enter to toggle fullscreen mode',
      '• Press Ctrl+L to clear the terminal',
      '',
      'For detailed help on any command, type: /help <command>',
      'For example: /help pace'
    ].join('\n');
  }
}