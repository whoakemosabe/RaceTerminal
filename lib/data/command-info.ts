// Central source for command descriptions and categories
export interface CommandInfo {
  description: string;
  shortDescription: string;
  category: string;
}

export const commandInfo: Record<string, CommandInfo> = {
  // Race Information
  '/standings': {
    description: 'View comprehensive Formula 1 Drivers Championship standings with points, wins, and position changes. Shows current season rankings with detailed statistics for each driver.',
    shortDescription: 'View driver championship standings',
    category: 'RACE INFORMATION'
  },
  '/teams': {
    description: 'Display detailed Formula 1 Constructors Championship standings including points, wins, podiums, and development progress throughout the season.',
    shortDescription: 'View constructor standings',
    category: 'RACE INFORMATION'
  },
  '/schedule': {
    description: 'Access the complete 2025 Formula 1 race calendar with dates, times, locations, and track information. Includes sprint races and testing sessions.',
    shortDescription: 'View race calendar',
    category: 'RACE INFORMATION'
  },
  '/next': {
    description: 'Get detailed information about the upcoming Formula 1 race including countdown, weather forecast, track details, and previous race history at the venue.',
    shortDescription: 'Next race info & countdown',
    category: 'RACE INFORMATION'
  },
  '/last': {
    description: 'Access comprehensive results from the most recent Formula 1 race including finishing positions, gaps, fastest laps, and key race moments.',
    shortDescription: 'Last race results',
    category: 'RACE INFORMATION'
  },
  '/track': {
    description: 'Explore detailed Formula 1 circuit information including track layout, length, corners, DRS zones, lap records, and historical race statistics.',
    shortDescription: 'Circuit details & records',
    category: 'RACE INFORMATION'
  },
  '/car': {
    description: 'Access detailed Formula 1 car specifications including technical data, performance metrics, development updates, and historical comparisons.',
    shortDescription: 'F1 car specifications',
    category: 'RACE INFORMATION'
  },

  // Live Data
  '/live': {
    description: 'Monitor live Formula 1 session timing with real-time positions, gaps, sector times, speed traps, and tire information during active sessions.',
    shortDescription: 'Real-time timing data',
    category: 'LIVE DATA'
  },
  '/telemetry': {
    description: 'Access real-time Formula 1 car telemetry data including throttle, brake, speed, gear, RPM, and energy deployment for any driver during active sessions.',
    shortDescription: 'Live car telemetry',
    category: 'LIVE DATA'
  },
  '/status': {
    description: 'Monitor current Formula 1 track status including flags, safety car periods, virtual safety car, red flags, and session status in real-time.',
    shortDescription: 'Track status & flags',
    category: 'LIVE DATA'
  },
  '/weather': {
    description: 'Get detailed weather information at the Formula 1 circuit including temperature, humidity, wind speed/direction, precipitation, and track temperature.',
    shortDescription: 'Circuit weather conditions',
    category: 'LIVE DATA'
  },
  '/tires': {
    description: 'Track Formula 1 tire usage including compounds, age, wear levels, and strategy predictions for each driver during active sessions.',
    shortDescription: 'Tire compounds & wear',
    category: 'LIVE DATA'
  },

  // Historical Data
  '/race': {
    description: 'Access detailed historical Formula 1 race results with full classification, gaps, retirements, and race analysis from any Grand Prix since 1950.',
    shortDescription: 'Historical race results',
    category: 'HISTORICAL DATA'
  },
  '/qualifying': {
    description: 'Explore Formula 1 qualifying results with detailed session breakdowns, lap times, sector performance, and elimination analysis from any Grand Prix.',
    shortDescription: 'Qualifying session results',
    category: 'HISTORICAL DATA'
  },
  '/sprint': {
    description: 'Access Formula 1 sprint race results including full classification, overtaking statistics, and performance analysis from sprint format events.',
    shortDescription: 'Sprint race results',
    category: 'HISTORICAL DATA'
  },
  '/pitstops': {
    description: 'Analyze Formula 1 pit stop data including timing, duration, tire choices, and strategic decisions from any race with detailed statistics.',
    shortDescription: 'Pit stop timings',
    category: 'HISTORICAL DATA'
  },
  '/fastest': {
    description: 'View detailed fastest lap information including sector times, speed traps, and lap evolution throughout any Formula 1 race session.',
    shortDescription: 'Fastest lap records',
    category: 'HISTORICAL DATA'
  },
  '/laps': {
    description: 'Access comprehensive Formula 1 lap time data with detailed analysis of consistency, tire degradation, and performance trends throughout a race.',
    shortDescription: 'Detailed lap times',
    category: 'HISTORICAL DATA'
  },

  // Analysis
  '/pace': {
    description: 'Perform in-depth Formula 1 race pace analysis including stint performance, tire degradation, fuel correction, and relative performance to competitors.',
    shortDescription: 'Race pace & stint analysis',
    category: 'ANALYSIS'
  },
  '/gap': {
    description: 'Analyze Formula 1 race gaps with detailed breakdowns of intervals, battles, defensive performance, and DRS effectiveness throughout a race.',
    shortDescription: 'Intervals & battle analysis',
    category: 'ANALYSIS'
  },
  '/sector': {
    description: 'Perform detailed Formula 1 sector analysis including mini-sectors, speed traps, corner speeds, and theoretical best lap calculations.',
    shortDescription: 'Qualifying sector analysis',
    category: 'ANALYSIS'
  },
  '/overtake': {
    description: 'Analyze Formula 1 overtaking with detailed statistics on moves, defensive performance, DRS effectiveness, and key battle moments in a race.',
    shortDescription: 'Race overtaking analysis',
    category: 'ANALYSIS'
  },
  '/plot': {
    description: 'Create visual ASCII charts of Formula 1 lap time progression with performance trends, fastest laps, and comparative analysis between drivers.',
    shortDescription: 'Lap time progression chart',
    category: 'ANALYSIS'
  },
  '/compare': {
    description: 'Perform detailed statistical comparisons between Formula 1 drivers or teams including career achievements, head-to-head records, and performance metrics.',
    shortDescription: 'Compare drivers/teams',
    category: 'ANALYSIS'
  },

  // Effects
  '/retro': {
    description: 'Enable classic retro terminal effects with customizable text glow, scanlines, and visual enhancements for a nostalgic computing experience.',
    shortDescription: 'Retro text glow effect',
    category: 'EFFECTS'
  },
  '/matrix': {
    description: 'Apply Matrix-inspired visual effects to the terminal including digital rain, green text effects, and dynamic animations.',
    shortDescription: 'Matrix digital rain',
    category: 'EFFECTS'
  },
  '/crt': {
    description: 'Enable classic CRT monitor simulation with screen curvature, scan lines, and subtle flicker effects for retro display aesthetics.',
    shortDescription: 'CRT monitor effect',
    category: 'EFFECTS'
  },
  '/glitch': {
    description: 'Create temporary visual glitch effects with screen distortion, color shifting, and digital artifacts for cyberpunk aesthetics.',
    shortDescription: 'Glitch visual effect',
    category: 'EFFECTS'
  },
  '/scanlines': {
    description: 'Add classic CRT monitor scanlines effect with customizable intensity and subtle screen glow for authentic retro display simulation.',
    shortDescription: 'CRT scanlines overlay',
    category: 'EFFECTS'
  },
  '/calc': {
    description: 'Transform terminal into a retro calculator display with authentic LCD aesthetics, multiple color schemes, and subtle visual effects.',
    shortDescription: 'Calculator LCD effect',
    category: 'EFFECTS'
  },

  // System
  '/user': {
    description: 'Manage terminal identity by setting a custom username or resetting to default. Username persists across sessions and affects command history.',
    shortDescription: 'Set terminal username',
    category: 'SYSTEM'
  },
  '/clear': {
    description: 'Clear all terminal output and command history. Can be triggered with Ctrl+L shortcut. Does not affect saved preferences or settings.',
    shortDescription: 'Clear terminal history',
    category: 'SYSTEM'
  },
  '/help': {
    description: 'Access comprehensive documentation and command reference organized by category with detailed examples, usage notes, and related commands.',
    shortDescription: 'Command documentation',
    category: 'SYSTEM'
  },
  '/theme': {
    description: 'Customize terminal appearance with F1 team colors, editor themes, or calculator display modes. Includes official team branding and custom color schemes.',
    shortDescription: 'Change color theme',
    category: 'SYSTEM'
  },
  '/sys': {
    description: 'Display detailed system information including version, uptime, memory usage, active effects, and terminal diagnostics for troubleshooting.',
    shortDescription: 'System diagnostics',
    category: 'SYSTEM'
  },
  '/hack': {
    description: 'Execute an entertaining simulated hacking sequence with visual effects, progress indicators, and dynamic status messages.',
    shortDescription: 'Hacking simulation',
    category: 'SYSTEM'
  },
  '/fontsize': {
    description: 'Customize terminal text size with precise control. Supports direct size input, incremental adjustments, and size presets for optimal readability.',
    shortDescription: 'Adjust text size',
    category: 'SYSTEM'
  },
  '/stats': {
    description: 'View detailed terminal usage statistics including command history, most used commands, session duration, and interaction patterns.',
    shortDescription: 'Usage statistics',
    category: 'SYSTEM'
  },
  '/decrypt': {
    description: 'Engage in an interactive code-breaking minigame with progressive difficulty, hints system, and score tracking.',
    shortDescription: 'Code-breaking game',
    category: 'SYSTEM'
  }
};