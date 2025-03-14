// Centralized quick reference data
export interface CommandCategory {
  title: string;
  filter: string[];
  description: string;
}

export const commandCategories: CommandCategory[] = [
  {
    title: 'RACE INFORMATION',
    filter: ['standings', 'schedule', 'next', 'last', 'track', 'car', 'race'],
    description: 'Commands for accessing race data, standings, and schedules',
    examples: [
      '/schedule - View 2025 F1 calendar',
      '/next - Next race details & schedule',
      '/last - Last race results',
      '/track monza - Circuit info'
    ]
  },
  {
    title: 'LIVE DATA',
    filter: ['live', 'telemetry', 'status', 'weather', 'tires'],
    description: 'Real-time data during active F1 sessions'
  },
  {
    title: 'HISTORICAL DATA',
    filter: ['qualifying', 'sprint', 'pitstops', 'fastest', 'laps', 'race'],
    description: 'Historical race results and statistics'
  },
  {
    title: 'ANALYSIS',
    filter: ['pace', 'gap', 'sector', 'overtake', 'plot', 'compare', 'sa', 'oa', 'ov', 'md', 'mt'],
    description: 'Advanced race and performance analysis tools'
  },
  {
    title: 'EFFECTS',
    filter: ['retro', 'matrix', 'crt', 'glitch', 'scanlines', 'calc'],
    description: 'Visual effects and terminal customization'
  },
  {
    title: 'SYSTEM',
    filter: ['user', 'clear', 'help', 'theme', 'sys', 'fontsize', 'stats', 'reset'],
    description: 'System commands and terminal management'
  }
];

// Keyboard shortcuts reference
export interface Shortcut {
  key: string;
  description: string;
}

export const shortcuts: Shortcut[] = [
  { key: 'Alt + Enter', description: 'Fullscreen' },
  { key: 'Tab', description: 'Complete' },
  { key: '↑/↓', description: 'History' },
  { key: 'Ctrl + L', description: 'Clear' },
  { key: 'Ctrl + C', description: 'Cancel' },
  { key: 'Esc', description: 'Close' }
];

// Command examples and usage
export interface CommandExample {
  command: string;
  description: string;
  examples: string[];
  notes?: string[];
  related?: string[];
}

export const commandExamples: Record<string, CommandExample> = {
  '/driver': {
    command: '/driver <name> (/d)',
    description: 'View F1 driver details, stats, and career info',
    examples: [
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
    notes: [
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
      '• Championship history'
    ],
    related: [
      '• /list drivers - List all available drivers',
      '• /compare - Compare driver statistics',
      '• /standings - Championship standings',
      '• /telemetry - Live car data',
      '• /team - View team information'
    ]
  },
  '/team': {
    command: '/team <name>',
    description: 'View F1 team history, achievements, and details',
    examples: [
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
    notes: [
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
      '• Historical records'
    ],
    related: [
      '• /list teams - List all available teams',
      '• /compare team - Compare team statistics',
      '• /teams - View constructor standings',
      '• /car - View car specifications',
      '• /theme - Apply team colors'
    ]
  },
  '/laps': {
    command: '/laps <year> <round> [driver]',
    description: 'View detailed lap time data',
    examples: [
      'View All Drivers:',
      '/laps 2024 1 - View all drivers\' lap times from 2024 Bahrain GP',
      '/laps 2023 22 - View all drivers\' lap times from 2023 Abu Dhabi GP',
      '',
      'Single Driver Analysis:',
      '/laps 2024 1 verstappen - View Max Verstappen\'s lap times',
      '/laps 2024 1 HAM - View Lewis Hamilton\'s lap times using code',
      '/laps 2024 1 44 - View Lewis Hamilton\'s lap times using number',
      '',
      'Historical Data:',
      '/laps 2023 5 - View Miami GP lap times',
      '/laps 2023 20 leclerc - View Charles Leclerc\'s Las Vegas GP times',
      '/laps 2023 22 NOR - View Lando Norris\'s Abu Dhabi GP times'
    ],
    notes: [
      'Available Data:',
      '• Individual lap times',
      '• Sector times',
      '• Position changes',
      '• Gap to leader',
      '• Interval tracking',
      '• Consistency analysis',
      '• Performance trends',
      '• Tire degradation',
      '• Battle tracking',
      '',
      'Features:',
      '• Lap time evolution',
      '• Track conditions',
      '• Fuel correction',
      '• Traffic impact',
      '• Stint analysis',
      '• Comparative timing',
      '• Statistical analysis',
      '',
      'Search Options:',
      '• Full name (e.g., verstappen)',
      '• Driver code (e.g., VER)',
      '• Race number (e.g., 1)',
      '',
      'Output Format:',
      '• Lap-by-lap timing',
      '• Best/worst laps',
      '• Average pace',
      '• Consistency rating',
      '• Performance trends'
    ],
    related: [
      '• /pace - Race analysis',
      '• /gap - Interval tracking',
      '• /plot - Time progression',
      '• /pitstops - Strategy impact',
      '• /overtake - Position changes',
      '• /fastest - Best lap data',
      '• /sector - Sector analysis',
      '• /compare - Driver comparison'
    ]
  }
};

// Quick tips for terminal usage
export const terminalTips = [
  'Use Tab for command completion',
  'Commands are case-insensitive',
  'Use /list to see available data',
  'Press Alt+Enter for fullscreen mode',
  'Press Ctrl+L to clear terminal',
  'Most commands have shortcuts'
];