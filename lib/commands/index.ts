export const commands = [
  // System Commands
  {
    command: '/list (/ls)',
    description: 'List current F1 drivers, teams, circuits, and historical data',
    source: 'System'
  },
  {
    command: '/help (/h)',
    description: 'Show detailed help and command reference by category',
    source: 'System'
  },
  {
    command: '/user <name|reset> (/u)',
    description: 'Set your terminal username or reset to default',
    source: 'System'
  },
  {
    command: '/clear',
    description: 'Clear terminal history and output (Ctrl+L)',
    source: 'System'
  },
  
  // Driver & Team Commands
  { 
    command: '/driver <name> (/d)', 
    description: 'View F1 driver details, stats, and career info',
    source: 'Ergast F1 API'
  },
  {
    command: '/team <name>',
    description: 'View F1 team history, achievements, and details',
    source: 'Ergast F1 API'
  },
  {
    command: '/compare <type> <name1> <name2> (/m)',
    description: 'Compare career statistics between F1 drivers or teams',
    source: 'Ergast F1 API'
  },
  
  // Race Information
  { 
    command: '/standings (/s)', 
    description: 'View current Formula 1 Drivers Championship standings',
    source: 'Ergast F1 API'
  },
  {
    command: '/teams (/cs)',
    description: 'View current Formula 1 Constructors Championship standings',
    source: 'Ergast F1 API'
  },
  { 
    command: '/schedule (/sc)', 
    description: 'View 2024 Formula 1 race calendar and schedule',
    source: 'Ergast F1 API'
  },
  {
    command: '/next (/n)',
    description: 'View details and countdown for the next Formula 1 race',
    source: 'Ergast F1 API'
  },
  {
    command: '/last',
    description: 'View results from the most recent Formula 1 race',
    source: 'Ergast F1 API'
  },
  { 
    command: '/track <name> (/t)', 
    description: 'View Formula 1 circuit details, layout, and records',
    source: 'Ergast F1 API'
  },
  {
    command: '/car <name|year> (/c)',
    description: 'View Formula 1 car specifications and performance data',
    source: 'System'
  },
  
  // Live Session Data
  { 
    command: '/live (/l)', 
    description: 'View real-time Formula 1 timing and positions',
    source: 'OpenF1 API'
  },
  {
    command: '/telemetry <number>',
    description: 'View live Formula 1 car telemetry by driver number',
    source: 'OpenF1 API'
  },
  {
    command: '/status',
    description: 'View current Formula 1 track status and flags',
    source: 'OpenF1 API'
  },
  {
    command: '/weather (/w)',
    description: 'View current weather conditions at Formula 1 circuit',
    source: 'OpenF1 API'
  },
  {
    command: '/tires <number>',
    description: 'View Formula 1 tire compound and wear by driver number',
    source: 'OpenF1 API'
  },
  
  // Historical Data
  { 
    command: '/race <year> [round] (/r)', 
    description: 'View historical Formula 1 race results by year and round',
    source: 'F1 Racing Results API'
  },
  { 
    command: '/qualifying <year> <round> (/q)', 
    description: 'View Formula 1 qualifying results by year and round',
    source: 'F1 Racing Results API'
  },
  { 
    command: '/laps <year> <round> [driver]', 
    description: 'View detailed Formula 1 lap times from a race',
    source: 'F1 Racing Results API'
  },
  { 
    command: '/pitstops <year> <round> (/p)', 
    description: 'View Formula 1 pit stop timings and strategies',
    source: 'F1 Racing Results API'
  },
  {
    command: '/fastest <year> <round> (/f)',
    description: 'View fastest lap records from a Formula 1 race',
    source: 'F1 Racing Results API'
  },
  {
    command: '/sprint <year> <round>',
    description: 'View Formula 1 sprint race results and statistics',
    source: 'F1 Racing Results API',
    category: 'Historical Data'
  },
  {
    command: '/pace <year> <round>',
    description: 'Analyze detailed race pace and consistency',
    source: 'Ergast F1 API',
    category: 'Analysis'
  },
  {
    command: '/gap <year> <round>',
    description: 'View detailed race gap analysis',
    source: 'Ergast F1 API',
    category: 'Analysis'
  },
  {
    command: '/sector <year> <round>',
    description: 'Analyze qualifying sector time comparisons',
    source: 'Ergast F1 API',
    category: 'Analysis'
  },
  {
    command: '/plot <year> <round> <driver>',
    description: 'Generate ASCII lap time progression chart',
    source: 'Ergast F1 API',
    category: 'Analysis'
  },
  {
    command: '/theme <team>',
    description: 'Change terminal colors to F1 team theme',
    source: 'System'
  },
  {
    command: '/fontsize <size|+|-|reset>',
    description: 'Adjust terminal text size (e.g., /fontsize 14)',
    source: 'System'
  },
  {
    command: '/retro',
    description: 'Toggle retro terminal text glow effect',
    source: 'System',
    category: 'Effects'
  },
  {
    command: '/matrix',
    description: 'Toggle Matrix-style terminal effects',
    source: 'System',
    category: 'Effects'
  },
  {
    command: '/stats',
    description: 'View your terminal usage statistics',
    source: 'System',
    category: 'System'
  },
  {
    command: '/sys',
    description: 'View system info and terminal diagnostics',
    source: 'System',
    category: 'System'
  },
  {
    command: '/hack <target>',
    description: 'Run simulated hacking sequence with effects',
    source: 'System',
    category: 'Fun'
  },
  {
    command: '/decrypt',
    description: 'Play interactive code-breaking minigame',
    source: 'System',
    category: 'Games'
  },
  {
    command: '/neofetch',
    description: 'View system info in stylized terminal format',
    source: 'System',
    category: 'System'
  },
  {
    command: '/matrix rain',
    description: 'Toggle Matrix digital rain background effect',
    source: 'System',
    category: 'Effects'
  },
  {
    command: '/glitch',
    description: 'Apply temporary glitch visual effect',
    source: 'System',
    category: 'Effects'
  },
  {
    command: '/crt',
    description: 'Toggle CRT monitor visual effects',
    source: 'System',
    category: 'Effects'
  },
  {
    command: '/colors calc [scheme]',
    description: 'Enable calculator mode with custom color schemes (classic, blue, amber, red, white)',
    source: 'System',
    category: 'Effects'
  },
  {
    command: '/calc',
    description: 'Toggle retro calculator LCD display effect with classic green theme',
    source: 'System',
    category: 'Effects'
  }
];