// Quick reference data structure
export interface QuickReferenceCategory {
  title: string;
  filter: string[];
}

export const quickReferenceCategories: QuickReferenceCategory[] = [
  {
    title: 'RACE INFORMATION',
    filter: ['standings', 'schedule', 'next', 'last', 'track', 'teams', 'car']
  },
  {
    title: 'LIVE DATA',
    filter: ['live', 'telemetry', 'status', 'weather', 'tires']
  },
  {
    title: 'HISTORICAL DATA',
    filter: ['race', 'qualifying', 'sprint', 'pitstops', 'fastest', 'laps']
  },
  {
    title: 'ANALYSIS',
    filter: ['pace', 'gap', 'sector', 'overtake', 'plot', 'compare', 'sa', 'oa', 'ov', 'md', 'mt']
  },
  {
    title: 'EFFECTS',
    filter: ['retro', 'matrix', 'crt', 'glitch', 'scanlines', 'calc']
  },
  {
    title: 'SYSTEM',
    filter: ['user', 'clear', 'help', 'theme', 'sys', 'hack', 'fontsize', 'stats', 'decrypt', 'reset']
  }
];

export interface KeyboardShortcut {
  key: string;
  description: string;
}

export const keyboardShortcuts: KeyboardShortcut[] = [
  { key: 'Alt + Enter', description: 'Fullscreen' },
  { key: 'Tab', description: 'Complete' },
  { key: '↑/↓', description: 'History' },
  { key: 'Ctrl + L', description: 'Clear' },
  { key: 'Ctrl + C', description: 'Cancel' },
  { key: 'Esc', description: 'Close' }
];

export interface QuickTip {
  text: string;
}

export const quickTips: QuickTip[] = [
  { text: 'Tab to auto-complete' },
  { text: 'Case-insensitive' },
  { text: 'Use /list for data' }
];