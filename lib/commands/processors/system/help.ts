import { commands } from '@/lib/commands';
import { CommandFunction } from '../index';

interface HelpCommands {
  [key: string]: CommandFunction;
}

// Command-specific help documentation
const commandHelp: Record<string, string> = {
  'theme': [
    '🎨 THEME COMMAND REFERENCE',
    '═'.repeat(50),
    '',
    'Change terminal color scheme and appearance.',
    '',
    'Usage: /theme <name>',
    'Examples:',
    '• /theme ferrari - Apply Ferrari team colors',
    '• /theme dracula - Use Dracula editor theme',
    '• /theme calc amber - Enable calculator mode with amber display',
    '',
    'Available Themes:',
    '',
    '1. F1 Team Themes',
    '   • All current F1 teams (e.g., ferrari, mercedes)',
    '   • Team-specific colors and branding',
    '   • Authentic racing aesthetics',
    '',
    '2. Editor Themes',
    '   • dracula - Dark theme with purple accents',
    '   • monokai - Dark theme with vibrant accents',
    '   • nord - Arctic-inspired dark theme',
    '   • tokyo-night - Clean dark theme inspired by Tokyo',
    '   • solarized - Precision colors for machines and people',
    '   • github-dark - GitHub dark theme',
    '   • gruvbox - Retro groove color scheme',
    '   • material - Material design inspired theme',
    '',
    '3. Calculator Themes',
    '   Usage: /theme calc <scheme>',
    '   Available schemes:',
    '   • classic - Traditional green LCD',
    '   • blue - Cool blue display',
    '   • amber - Warm amber screen',
    '   • red - Red LED display',
    '   • white - Modern LCD look',
    '',
    'Reset Theme:',
    '• /theme default - Restore default terminal colors',
    '',
    'Notes:',
    '• Themes persist between sessions',
    '• Each theme includes:',
    '  - Primary and secondary colors',
    '  - Background and text colors',
    '  - Border and accent colors',
    '  - Terminal history colors',
    '',
    'Related Commands:',
    '• /retro - Retro text effects',
    '• /matrix - Matrix effects',
    '• /crt - CRT monitor effects',
    '• /calc - Calculator mode'
  ].join('\n'),

  'calculator': [
    '🖩 CALCULATOR MODE REFERENCE',
    '═'.repeat(50),
    '',
    'Enable retro calculator LCD display mode.',
    '',
    'Usage:',
    '1. Basic toggle: /calc',
    '2. With colors: /theme calc <scheme>',
    '',
    'Features:',
    '• Retro LCD display effect',
    '• Multiple color schemes',
    '• Subtle scan lines',
    '• Vintage calculator aesthetics',
    '• Authentic LCD styling',
    '',
    'Color Schemes:',
    '• classic - Traditional green LCD',
    '• blue    - Cool blue display',
    '• amber   - Warm amber screen',
    '• red     - Red LED display',
    '• white   - Modern LCD look',
    '',
    'Related Commands:',
    '• /theme calc - Change calculator colors',
    '• /retro - Retro text effects',
    '• /theme - Terminal themes'
  ].join('\n'),

  'stats': [
    '📊 TERMINAL STATISTICS REFERENCE',
    '═'.repeat(50),
    '',
    'View detailed terminal usage statistics.',
    '',
    'Usage: /stats',
    '',
    'Displayed Information:',
    '• Command usage frequency',
    '• Most used commands',
    '• Session duration',
    '• Data retrieved',
    '• System performance',
    '',
    'Notes:',
    '• Statistics persist between sessions',
    '• Tracks command history',
    '• Shows performance metrics'
  ].join('\n'),

  'sys': [
    '🖥️  SYSTEM COMMAND REFERENCE',
    '═'.repeat(50),
    '',
    'View comprehensive system information and diagnostics.',
    '',
    'Usage: /sys',
    '',
    'Displayed Information:',
    '',
    '1. System Info',
    '   • OS and kernel version',
    '   • Terminal version',
    '   • Shell environment',
    '',
    '2. Theme & Display',
    '   • Current theme',
    '   • Font size',
    '   • Calculator mode status',
    '   • Active visual effects',
    '',
    '3. Performance',
    '   • Session uptime',
    '   • Memory usage',
    '   • Screen resolution',
    '',
    '4. Environment',
    '   • Protocol',
    '   • Connection status',
    '   • User agent',
    '',
    'Features:',
    '• Real-time system monitoring',
    '• Comprehensive diagnostics',
    '• Performance metrics',
    '• Environment details',
    '',
    'Notes:',
    '• Updates in real-time',
    '• Shows all active effects',
    '• Displays current theme',
    '',
    'Related Commands:',
    '• /theme - Change terminal theme',
    '• /fontsize - Adjust text size',
    '• /clear - Clear terminal history'
  ].join('\n'),

  'decrypt': [
    '🔓 DECRYPTION GAME REFERENCE',
    '═'.repeat(50),
    '',
    'Play an interactive code-breaking minigame.',
    '',
    'Usage: /decrypt',
    '',
    'Game Features:',
    '• Multiple difficulty levels',
    '• Timed challenges',
    '• Score tracking',
    '• Progressive difficulty',
    '',
    'Notes:',
    '• Use logic to crack codes',
    '• Limited attempts per puzzle',
    '• Includes tutorial mode',
    '',
    'Related Commands:',
    '• /hack - Hacking simulation',
    '• /matrix - Matrix effects',
    '• /glitch - Glitch effects'
  ].join('\n'),

  'telemetry': [
    '📊 TELEMETRY COMMAND REFERENCE',
    '═'.repeat(50),
    '',
    'Get real-time car telemetry data during active sessions.',
    '',
    'Usage: /telemetry <driver_number>',
    'Example: /telemetry 44',
    '',
    'Available Data:',
    '• Speed (km/h)',
    '• RPM',
    '• Throttle position (%)',
    '• Brake position (%)',
    '• Gear',
    '• Engine temperature',
    '',
    'Notes:',
    '• Only available during active sessions',
    '• Updates in real-time',
    '• Use driver numbers (e.g., 1, 44, 16)',
    '',
    'Related Commands:',
    '• /live - Live timing data',
    '• /tires - Tire compound data',
    '• /weather - Track conditions'
  ].join('\n'),

  'live': [
    '📊 LIVE TIMING COMMAND REFERENCE',
    '═'.repeat(50),
    '',
    'Get real-time timing data during active sessions.',
    '',
    'Usage: /live',
    '',
    'Available Data:',
    '• Position',
    '• Last lap time',
    '• Sector times (S1, S2, S3)',
    '• Speed trap',
    '',
    'Notes:',
    '• Only available during active sessions',
    '• Updates automatically',
    '• Shows top 10 drivers by default',
    '',
    'Related Commands:',
    '• /telemetry - Car telemetry',
    '• /status - Track status',
    '• /weather - Track conditions'
  ].join('\n'),

  'weather': [
    '🌤️ WEATHER COMMAND REFERENCE',
    '═'.repeat(50),
    '',
    'Get current weather conditions at the circuit.',
    '',
    'Usage: /weather',
    'Shortcuts: /w, /wx',
    '',
    'Available Data:',
    '• Track status',
    '• Air temperature',
    '• Track temperature',
    '• Humidity',
    '• Pressure',
    '• Wind speed & direction',
    '• Rainfall',
    '',
    'Notes:',
    '• Only available during race weekends',
    '• Updates in real-time',
    '• Includes track status indicators',
    '',
    'Related Commands:',
    '• /status - Track status',
    '• /live - Live timing',
    '• /telemetry - Car telemetry'
  ].join('\n'),

  'pace': [
    '📊 RACE PACE ANALYSIS REFERENCE',
    '═'.repeat(50),
    '',
    'Analyze detailed race pace and consistency.',
    '',
    'Usage: /pace <year> <round>',
    'Example: /pace 2023 1',
    '',
    'Available Data:',
    '• Average lap times',
    '• Stint performance',
    '• Tire management',
    '• Consistency metrics',
    '• Performance trends',
    '',
    'Features:',
    '• Detailed stint analysis',
    '• Tire degradation tracking',
    '• Performance ratings',
    '• Lap time consistency',
    '',
    'Performance Ratings:',
    '• 💫 Outstanding',
    '• 🟢 Strong',
    '• 🟡 Fair',
    '• 🔴 Poor',
    '',
    'Related Commands:',
    '• /gap - Race gap analysis',
    '• /sector - Sector analysis',
    '• /overtake - Overtaking analysis'
  ].join('\n'),

  'gap': [
    '📊 RACE GAP ANALYSIS REFERENCE',
    '═'.repeat(50),
    '',
    'Analyze race intervals and battles.',
    '',
    'Usage: /gap <year> <round>',
    'Example: /gap 2023 1',
    '',
    'Available Data:',
    '• Intervals between drivers',
    '• Gap to leader',
    '• Position changes',
    '• Battle analysis',
    '',
    'Features:',
    '• Real-time gap tracking',
    '• Consistency ratings',
    '• Battle identification',
    '• Performance trends',
    '',
    'Consistency Ratings:',
    '• 🟢 High (±0.5s)',
    '• 🟡 Medium (±1.0s)',
    '• 🔴 Low (>±1.0s)',
    '',
    'Related Commands:',
    '• /pace - Race pace analysis',
    '• /sector - Sector analysis',
    '• /overtake - Overtaking analysis'
  ].join('\n'),

  'compare': [
    '🏆 COMPARISON COMMAND REFERENCE',
    '═'.repeat(50),
    '',
    'Compare career statistics between drivers or teams.',
    '',
    'Usage:',
    '1. Compare Drivers:',
    '   /compare driver <driver1> <driver2>',
    '   Shortcut: /md <driver1> <driver2>',
    '',
    '2. Compare Teams:',
    '   /compare team <team1> <team2>',
    '   Shortcut: /mt <team1> <team2>',
    '',
    'Examples:',
    '• /compare driver verstappen hamilton',
    '• /md verstappen hamilton',
    '• /compare team redbull mercedes',
    '• /mt redbull mercedes',
    '',
    'Available Statistics:',
    '• Championships',
    '• Race wins',
    '• Podiums',
    '• Pole positions',
    '• Fastest laps',
    '• Points',
    '• Win rate',
    '• Podium rate',
    '',
    'Notes:',
    '• Use driver names, codes, or numbers',
    '• Team names and abbreviations supported',
    '• Historical data included',
    '',
    'Related Commands:',
    '• /driver - Driver information',
    '• /team - Team information',
    '• /standings - Championship standings'
  ].join('\n'),

  'sector': [
    '📊 QUALIFYING SECTOR ANALYSIS REFERENCE',
    '═'.repeat(50),
    '',
    'Analyze qualifying sector time comparisons.',
    '',
    'Usage: /sector <year> <round>',
    'Example: /sector 2023 1',
    'Shortcut: /sa',
    '',
    'Available Data:',
    '• Sector time comparisons',
    '• Theoretical best lap',
    '• Purple/green/yellow sectors',
    '• Time lost to ideal lap',
    '• Session improvements',
    '',
    'Features:',
    '• Detailed sector breakdowns',
    '• Performance indicators',
    '• Improvement tracking',
    '• Visual sector markers',
    '',
    'Notes:',
    '• Purple: Fastest sector',
    '• Green: Within 1% of fastest',
    '• Yellow: Within 2% of fastest',
    '• White: Over 2% off fastest',
    '',
    'Related Commands:',
    '• /qualifying - Full Q1/Q2/Q3 results',
    '• /gap - Race gap analysis',
    '• /pace - Race pace analysis'
  ].join('\n'),

  'overtake': [
    '🏎️ OVERTAKING ANALYSIS REFERENCE',
    '═'.repeat(50),
    '',
    'Analyze race overtaking statistics.',
    '',
    'Usage: /overtake <year> <round>',
    'Example: /overtake 2023 1',
    'Shortcuts: /oa, /ov',
    '',
    'Available Data:',
    '• Position changes',
    '• DRS vs non-DRS moves',
    '• Defensive statistics',
    '• Key overtaking moments',
    '',
    'Features:',
    '• Detailed move tracking',
    '• DRS effectiveness',
    '• Defense ratings',
    '• Lap-by-lap analysis',
    '',
    'Performance Ratings:',
    '• 🟣 Exceptional (5+ overtakes)',
    '• 🟢 Strong (3-4 overtakes)',
    '• 🟡 Active (1-2 overtakes)',
    '• ⚪ Limited (0 overtakes)',
    '',
    'Defense Ratings:',
    '• 🟢 Clean Race (no positions lost)',
    '• 🟢 Solid (1-2 positions lost)',
    '• 🟡 Under Pressure (3-4 positions lost)',
    '• 🔴 Defensive (5+ positions lost)',
    '',
    'Related Commands:',
    '• /race - Full race results',
    '• /gap - Race gap analysis',
    '• /pace - Race pace analysis'
  ].join('\n'),

  'effects': [
    '✨ VISUAL EFFECTS COMMAND REFERENCE',
    '═'.repeat(50),
    '',
    'Available Effects Commands:',
    '',
    '1. /retro',
    '   • Toggle retro text glow effect',
    '   • Usage: /retro [all|reset]',
    '',
    '2. /matrix',
    '   • Toggle Matrix-style digital rain',
    '   • Usage: /matrix',
    '',
    '3. /crt',
    '   • Toggle CRT monitor effects',
    '   • Usage: /crt',
    '',
    '4. /scanlines',
    '   • Toggle scanline overlay',
    '   • Usage: /scanlines',
    '',
    '5. /glitch',
    '   • Apply temporary glitch effect',
    '   • Usage: /glitch',
    '',
    'Notes:',
    '• Effects can be combined',
    '• Use /retro all to enable all effects',
    '• Use /retro reset to disable all effects',
    '• Effects persist between sessions',
    '',
    'Related Commands:',
    '• /theme - Change color theme',
    '• /fontsize - Adjust text size'
  ].join('\n'),

  'list': [
    '📋 LIST COMMAND REFERENCE',
    '═'.repeat(50),
    '',
    'List available F1 data and information.',
    '',
    'Usage: /list <type>',
    'Shortcut: /ls <type>',
    '',
    'Available Types:',
    '• drivers - Current drivers, champions, and legends',
    '• teams - Current F1 teams and details',
    '• tracks - F1 circuits and information',
    '• cars - F1 cars and specifications',
    '',
    'Examples:',
    '• /list drivers',
    '• /list teams',
    '• /ls tracks',
    '• /ls cars',
    '',
    'Notes:',
    '• Includes historical data',
    '• Shows detailed information',
    '• Supports team colors',
    '• Displays country flags',
    '',
    'Related Commands:',
    '• /driver - Driver details',
    '• /team - Team information',
    '• /track - Circuit details',
    '• /car - Car specifications'
  ].join('\n')
};

const categories = {
  'Lists & Data': commands.filter(c => 
    ['list', 'ls'].some(term => 
      c.command.toLowerCase().includes(term)
    )
  ),
  'Race Information': commands.filter(c => 
    ['standings', 'schedule', 'next', 'last', 'track', 'teams', 'car'].some(term => 
      c.command.toLowerCase().includes(term)
    )
  ),
  'Live Data': commands.filter(c => 
    ['live', 'telemetry', 'status', 'weather', 'tires'].some(term => 
      c.command.toLowerCase().includes(term)
    )
  ),
  'Historical Data': commands.filter(c => 
    ['race', 'qualifying', 'sprint', 'pitstops', 'fastest', 'laps'].some(term => 
      c.command.toLowerCase().includes(term)
    )
  ),
  'Analysis': commands.filter(c => 
    c.category?.toLowerCase() === 'analysis' ||
    ['pace', 'gap', 'sector', 'overtake', 'plot', 'compare'].some(term => 
      c.command.toLowerCase().includes(term)
    )
  ),
  'Driver & Team': commands.filter(c => 
    ['driver', 'team', 'compare', '/md', '/mt'].some(term => 
      c.command.toLowerCase().includes(term)
    )
  ),
  'System': commands.filter(c => 
    ['user', 'clear', 'help', 'theme', 'sys', 'neofetch', 'hack', 'fontsize', 'stats', 'decrypt', 'reset'].some(term => 
      c.command.toLowerCase().includes(term)
    ) || c.category?.toLowerCase() === 'system'
  ),
  'Effects': commands.filter(c =>
    ['retro', 'matrix', 'crt', 'glitch', 'scanlines', 'rain', 'calc', 'calculator'].some(term =>
      c.command.toLowerCase().includes(term)
    ) || c.category?.toLowerCase() === 'effects'
  )
};

const formatCommand = (cmd: typeof commands[0]) => {
  const [baseCmd, ...params] = cmd.command.split(' ');
  const aliases = baseCmd.match(/\((.*?)\)/)?.[1] || '';
  const cleanCmd = baseCmd.replace(/\s*\(.*?\)/, '');
  const shortDesc = getShortDescription(cleanCmd);
  
  return [
    `${cleanCmd}${params.length ? ' ' + params.join(' ') : ''}`,
    aliases ? `Aliases: ${aliases}` : '',
    `Description: ${shortDesc || cmd.description}`,
    `Source: ${cmd.source}`,
    ''
  ].filter(Boolean).join('\n');
};

// Short descriptions for commands
export function getShortDescription(cmd: string): string {
  switch (cmd) {
    // Race Information
    case '/standings': return 'View driver championship standings';
    case '/teams': return 'View constructor standings';
    case '/schedule': return 'View race calendar';
    case '/next': return 'Next race info & countdown';
    case '/last': return 'Last race results';
    case '/track': return 'Circuit details & records';
    case '/car': return 'F1 car specifications';
    
    // Live Data
    case '/live': return 'Real-time timing data';
    case '/telemetry': return 'Live car telemetry';
    case '/status': return 'Track status & flags';
    case '/weather': return 'Circuit weather conditions';
    case '/tires': return 'Tire compounds & wear';
    
    // Historical Data
    case '/race': return 'Historical race results';
    case '/qualifying': return 'Qualifying session results';
    case '/sprint': return 'Sprint race results';
    case '/pitstops': return 'Pit stop timings';
    case '/fastest': return 'Fastest lap records';
    case '/laps': return 'Detailed lap times';
    
    // Analysis
    case '/pace': return 'Race pace & stint analysis';
    case '/gap': return 'Intervals & battle analysis';
    case '/compare': return 'Compare drivers/teams';
    case '/sector': return 'Qualifying sector analysis';
    case '/overtake': return 'Race overtaking analysis';
    case '/plot': return 'Lap time progression chart';
    
    // Effects
    case '/retro': return 'Retro text glow effect';
    case '/matrix': return 'Matrix digital rain';
    case '/crt': return 'CRT monitor effect';
    case '/glitch': return 'Glitch visual effect';
    case '/scanlines': return 'CRT scanlines overlay';
    case '/calc': return 'Calculator LCD effect';
    
    // System
    case '/user': return 'Set terminal username';
    case '/clear': return 'Clear terminal history';
    case '/help': return 'Command documentation';
    case '/theme': return 'Change color theme';
    case '/sys': return 'System diagnostics';
    case '/neofetch': return 'System info display';
    case '/hack': return 'Hacking simulation';
    case '/fontsize': return 'Adjust text size';
    case '/stats': return 'Usage statistics';
    case '/decrypt': return 'Code-breaking game';
    
    default: return '';
  }
}

export const helpCommands: HelpCommands = {
  '/help': async (args: string[]) => {
    // If a specific command is provided
    if (args[0]) {
      const searchTerm = args[0].toLowerCase().replace('/', '');
      
      // Handle command aliases
      const aliasMap = {
        'sa': 'sector',
        'oa': 'overtake',
        'ov': 'overtake',
        'md': 'compare',
        'mt': 'compare'
      };
      
      const resolvedTerm = aliasMap[searchTerm] || searchTerm;
      
      // Check for direct command help
      if (commandHelp[resolvedTerm]) {
        return commandHelp[resolvedTerm];
      }

      // Check for category help
      const category = Object.entries(categories).find(([name]) => 
        name.toLowerCase().includes(resolvedTerm)
      );

      if (category) {
        return [
          `📚 ${category[0].toUpperCase()} COMMANDS`,
          '═'.repeat(50),
          '',
          ...category[1].map(formatCommand)
        ].join('\n');
      }

      // Check for command in any category
      for (const [catName, catCommands] of Object.entries(categories)) {
        const command = catCommands.find(c => 
          c.command.toLowerCase().includes(resolvedTerm) ||
          c.command.toLowerCase().includes(`/${resolvedTerm}`)
        );
        if (command) {
          return commandHelp[resolvedTerm] || formatCommand(command);
        }
      }
      return [
        '❌ Help topic not found. Try one of these:',
        '',
        'Categories:',
        ...Object.keys(categories).map(cat => `• ${cat}`),
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
      '═'.repeat(50),
      '',
      'All available commands by category:',
      ''
    ];

    const content = [
      '🏁 RACE INFORMATION',
      '═'.repeat(50),
      '/standings (/s) - View current Formula 1 Drivers Championship standings',
      '/teams (/cs) - View current Formula 1 Constructors Championship standings',
      '/schedule (/sc) - View 2024 Formula 1 race calendar and schedule',
      '/next (/n) - View details and countdown for the next Formula 1 race',
      '/last - View results from the most recent Formula 1 race',
      '/track (/t) <name> - View Formula 1 circuit details, layout, and records',
      '/car (/c) <name|year> - View Formula 1 car specifications and performance data',
      '',
      '📊 LIVE DATA',
      '═'.repeat(50),
      '/live (/l) - View real-time Formula 1 timing and positions',
      '/telemetry <number> - View live Formula 1 car telemetry by driver number',
      '/status - View current Formula 1 track status and flags',
      '/weather (/w) - View current weather conditions at Formula 1 circuit',
      '/tires <number> - View Formula 1 tire compound and wear by driver number',
      '',
      '📅 HISTORICAL DATA',
      '═'.repeat(50),
      '/race (/r) <year> [round] - View historical Formula 1 race results',
      '/qualifying (/q) <year> <round> - View Formula 1 qualifying results',
      '/sprint (/sp) <year> <round> - View Formula 1 sprint race results',
      '/pitstops (/p) <year> <round> - View Formula 1 pit stop timings',
      '/fastest (/f) <year> <round> - View fastest lap records',
      '/laps <year> <round> [driver] - View detailed Formula 1 lap times',
      '',
      '📈 ANALYSIS',
      '═'.repeat(50),
      '/pace <year> <round> - Analyze detailed race pace and consistency',
      '/gap <year> <round> - View detailed race gap analysis',
      '/sector (/sa) <year> <round> - Analyze qualifying sector times and comparisons',
      '/overtake (/oa, /ov) <year> <round> - Analyze race overtaking statistics',
      '/plot <year> <round> <driver> - Generate ASCII lap time progression chart',
      '/compare (/m) <type> <name1> <name2> - Compare driver or team statistics',
      '/md <driver1> <driver2> - Quick driver comparison shortcut',
      '/mt <team1> <team2> - Quick team comparison shortcut',
      '',
      '👤 DRIVER & TEAM',
      '═'.repeat(50),
      '/driver (/d) <name> - View F1 driver details, stats, and career info',
      '/team <name> - View F1 team history, achievements, and details',
      '',
      '✨ EFFECTS',
      '═'.repeat(50),
      '/retro - Toggle retro terminal text glow effect',
      '/matrix - Toggle Matrix-style terminal effects',
      '/matrix rain - Toggle Matrix digital rain background effect',
      '/crt - Toggle CRT monitor visual effects',
      '/scanlines - Toggle scanline overlay',
      '/glitch - Apply temporary glitch visual effect',
      '/calc - Toggle retro calculator LCD display effect',
      '',
      '⚙️ SYSTEM',
      '═'.repeat(50),
      '/user (/u) <name|reset> - Set your terminal username or reset to default',
      '/clear - Clear terminal history and output (Ctrl+L)',
      '/help (/h) - Show detailed help and command reference',
      '/theme <name> - Change terminal colors to F1 team theme',
      '/fontsize <size|+|-|reset> - Adjust terminal text size',
      '/sys - View system info and terminal diagnostics',
      '/neofetch - View system info in stylized terminal format',
      '/hack <target> - Run simulated hacking sequence with effects',
      '/decrypt - Play interactive code-breaking minigame',
      '/stats - View your terminal usage statistics',
      '',
      '📋 DATA LISTS',
      '═'.repeat(50),
      '/list (/ls) drivers - List all F1 drivers (current and historical)',
      '/list (/ls) teams - List all F1 teams and details',
      '/list (/ls) tracks - List all F1 circuits and information',
      '/list (/ls) cars - List all F1 cars and specifications'
    ];

    return [
      ...header,
      ...content,
      '',
      'Tips:',
      '• Use /list <type> to see available data (drivers, teams, tracks, cars)',
      '• Use Tab for command completion',
      '• Commands are case-insensitive',
      '• Most commands have shortcuts (shown in parentheses)',
      '• Press Alt+Enter to toggle fullscreen mode',
      '• Press Ctrl+L to clear the terminal'
    ].join('\n');
  }
};