export const commands = [
  {
    command: '/username <name|reset>',
    description: 'Change your terminal display name (e.g., /username max) or reset to default (/username reset)',
    source: 'System'
  },
  { 
    command: '/driver <name>', 
    description: 'Get driver info (e.g., /driver hamilton)',
    source: 'Ergast F1 API'
  },
  { 
    command: '/standings', 
    description: 'View current championship standings',
    source: 'Ergast F1 API'
  },
  { 
    command: '/schedule', 
    description: 'View race schedule',
    source: 'Ergast F1 API'
  },
  { 
    command: '/track <name>', 
    description: 'Get track information (e.g., /track monza)',
    source: 'Ergast F1 API'
  },
  { 
    command: '/live', 
    description: 'Get live timing data during race sessions',
    source: 'OpenF1 API'
  },
  {
    command: '/telemetry <number>',
    description: 'Get real-time car telemetry for a driver (e.g., /telemetry 44)',
    source: 'OpenF1 API'
  },
  {
    command: '/status',
    description: 'Get current track status and conditions',
    source: 'OpenF1 API'
  },
  { 
    command: '/race <year> [round]', 
    description: 'Get race results (e.g., /race 2023 1)',
    source: 'F1 Racing Results API'
  },
  { 
    command: '/qualifying <year> <round>', 
    description: 'Get qualifying results (e.g., /qualifying 2023 1)',
    source: 'F1 Racing Results API'
  },
  { 
    command: '/laps <year> <round> [driver]', 
    description: 'Get lap times for a race. Driver code is optional (e.g., /laps 2023 1 or /laps 2023 1 HAM)',
    source: 'F1 Racing Results API'
  },
  { 
    command: '/pitstops <year> <round>', 
    description: 'Get pit stop data (e.g., /pitstops 2023 1)',
    source: 'F1 Racing Results API'
  },
];