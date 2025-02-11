// Central source for command descriptions and categories
export interface CommandInfo {
  description: string;
  shortDescription: string;
  category: string;
}

export const commandInfo: Record<string, CommandInfo> = {
  // Race Information
  '/standings': {
    description: 'View current Formula 1 Drivers Championship standings',
    shortDescription: 'View driver championship standings',
    category: 'RACE INFORMATION'
  },
  '/teams': {
    description: 'View current Formula 1 Constructors Championship standings',
    shortDescription: 'View constructor standings',
    category: 'RACE INFORMATION'
  },
  '/schedule': {
    description: 'View 2024 Formula 1 race calendar and schedule',
    shortDescription: 'View race calendar',
    category: 'RACE INFORMATION'
  },
  '/next': {
    description: 'View details and countdown for the next Formula 1 race',
    shortDescription: 'Next race info & countdown',
    category: 'RACE INFORMATION'
  },
  '/last': {
    description: 'View results from the most recent Formula 1 race',
    shortDescription: 'Last race results',
    category: 'RACE INFORMATION'
  },
  '/track': {
    description: 'View Formula 1 circuit details, layout, and records',
    shortDescription: 'Circuit details & records',
    category: 'RACE INFORMATION'
  },
  '/car': {
    description: 'View Formula 1 car specifications and performance data',
    shortDescription: 'F1 car specifications',
    category: 'RACE INFORMATION'
  },

  // Live Data
  '/live': {
    description: 'View real-time Formula 1 timing and positions',
    shortDescription: 'Real-time timing data',
    category: 'LIVE DATA'
  },
  '/telemetry': {
    description: 'View live Formula 1 car telemetry by driver number',
    shortDescription: 'Live car telemetry',
    category: 'LIVE DATA'
  },
  '/status': {
    description: 'View current Formula 1 track status and flags',
    shortDescription: 'Track status & flags',
    category: 'LIVE DATA'
  },
  '/weather': {
    description: 'View current weather conditions at Formula 1 circuit',
    shortDescription: 'Circuit weather conditions',
    category: 'LIVE DATA'
  },
  '/tires': {
    description: 'View Formula 1 tire compound and wear by driver number',
    shortDescription: 'Tire compounds & wear',
    category: 'LIVE DATA'
  },

  // Historical Data
  '/race': {
    description: 'View historical Formula 1 race results by year and round',
    shortDescription: 'Historical race results',
    category: 'HISTORICAL DATA'
  },
  '/qualifying': {
    description: 'View Formula 1 qualifying results by year and round',
    shortDescription: 'Qualifying session results',
    category: 'HISTORICAL DATA'
  },
  '/sprint': {
    description: 'View Formula 1 sprint race results and statistics',
    shortDescription: 'Sprint race results',
    category: 'HISTORICAL DATA'
  },
  '/pitstops': {
    description: 'View Formula 1 pit stop timings and strategies',
    shortDescription: 'Pit stop timings',
    category: 'HISTORICAL DATA'
  },
  '/fastest': {
    description: 'View fastest lap records from a Formula 1 race',
    shortDescription: 'Fastest lap records',
    category: 'HISTORICAL DATA'
  },
  '/laps': {
    description: 'View detailed Formula 1 lap times from a race',
    shortDescription: 'Detailed lap times',
    category: 'HISTORICAL DATA'
  },

  // Analysis
  '/pace': {
    description: 'Analyze detailed race pace and consistency',
    shortDescription: 'Race pace & stint analysis',
    category: 'ANALYSIS'
  },
  '/gap': {
    description: 'View detailed race gap analysis',
    shortDescription: 'Intervals & battle analysis',
    category: 'ANALYSIS'
  },
  '/sector': {
    description: 'Analyze qualifying sector time comparisons',
    shortDescription: 'Qualifying sector analysis',
    category: 'ANALYSIS'
  },
  '/overtake': {
    description: 'Analyze race overtaking statistics',
    shortDescription: 'Race overtaking analysis',
    category: 'ANALYSIS'
  },
  '/plot': {
    description: 'Generate ASCII lap time progression chart',
    shortDescription: 'Lap time progression chart',
    category: 'ANALYSIS'
  },
  '/compare': {
    description: 'Compare career statistics between F1 drivers or teams',
    shortDescription: 'Compare drivers/teams',
    category: 'ANALYSIS'
  },

  // Effects
  '/retro': {
    description: 'Toggle retro terminal text glow effect',
    shortDescription: 'Retro text glow effect',
    category: 'EFFECTS'
  },
  '/matrix': {
    description: 'Toggle Matrix-style terminal effects',
    shortDescription: 'Matrix digital rain',
    category: 'EFFECTS'
  },
  '/crt': {
    description: 'Toggle CRT monitor visual effects',
    shortDescription: 'CRT monitor effect',
    category: 'EFFECTS'
  },
  '/glitch': {
    description: 'Apply temporary glitch visual effect',
    shortDescription: 'Glitch visual effect',
    category: 'EFFECTS'
  },
  '/scanlines': {
    description: 'Toggle CRT scanlines overlay',
    shortDescription: 'CRT scanlines overlay',
    category: 'EFFECTS'
  },
  '/calc': {
    description: 'Toggle retro calculator LCD display effect with classic green theme',
    shortDescription: 'Calculator LCD effect',
    category: 'EFFECTS'
  },

  // System
  '/user': {
    description: 'Set your terminal username or reset to default',
    shortDescription: 'Set terminal username',
    category: 'SYSTEM'
  },
  '/clear': {
    description: 'Clear terminal history and output (Ctrl+L)',
    shortDescription: 'Clear terminal history',
    category: 'SYSTEM'
  },
  '/help': {
    description: 'Show detailed help and command reference by category',
    shortDescription: 'Command documentation',
    category: 'SYSTEM'
  },
  '/theme': {
    description: 'Change terminal colors to F1 team theme',
    shortDescription: 'Change color theme',
    category: 'SYSTEM'
  },
  '/sys': {
    description: 'View system info and terminal diagnostics',
    shortDescription: 'System diagnostics',
    category: 'SYSTEM'
  },
  '/hack': {
    description: 'Run simulated hacking sequence with effects',
    shortDescription: 'Hacking simulation',
    category: 'SYSTEM'
  },
  '/fontsize': {
    description: 'Adjust terminal text size (e.g., /fontsize 14)',
    shortDescription: 'Adjust text size',
    category: 'SYSTEM'
  },
  '/stats': {
    description: 'View your terminal usage statistics',
    shortDescription: 'Usage statistics',
    category: 'SYSTEM'
  },
  '/decrypt': {
    description: 'Play interactive code-breaking minigame',
    shortDescription: 'Code-breaking game',
    category: 'SYSTEM'
  }
};