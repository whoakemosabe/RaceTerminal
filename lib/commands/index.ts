export const commands = [
  // System Commands
  {
    command: '/reset',
    description: 'Reset terminal session and clear history',
    source: 'System'
  },
  {
    command: '/username <name|reset>',
    description: 'Change your terminal display name (e.g., /username max) or reset to default (/username reset). Alias: /user',
    source: 'System'
  },
  {
    command: '/clear',
    description: 'Clear the terminal history (alias: Ctrl+L)',
    source: 'System'
  },
  
  // Driver & Team Commands
  { 
    command: '/driver <name>', 
    description: 'Get driver info (e.g., /driver hamilton)',
    source: 'Ergast F1 API'
  },
  {
    command: '/team <name>',
    description: 'Get constructor/team info (e.g., /team ferrari)',
    source: 'Ergast F1 API'
  },
  {
    command: '/compare <type> <name1> <name2>',
    description: 'Compare drivers or teams (e.g., /compare driver verstappen hamilton or /compare team redbull mercedes)',
    source: 'Ergast F1 API'
  },
  
  // Race Information
  { 
    command: '/standings', 
    description: 'View current championship standings',
    source: 'Ergast F1 API'
  },
  {
    command: '/teams',
    description: 'View current constructor standings',
    source: 'Ergast F1 API'
  },
  { 
    command: '/schedule', 
    description: 'View race schedule',
    source: 'Ergast F1 API'
  },
  {
    command: '/next',
    description: 'Get details about the next race',
    source: 'Ergast F1 API'
  },
  {
    command: '/last',
    description: 'Get results from the last race',
    source: 'Ergast F1 API'
  },
  { 
    command: '/track <name>', 
    description: 'Get track information (e.g., /track monza)',
    source: 'Ergast F1 API'
  },
  
  // Live Session Data
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
    command: '/weather',
    description: 'Get current weather conditions at the track',
    source: 'OpenF1 API'
  },
  {
    command: '/tires <number>',
    description: 'Get tire information for a driver (e.g., /tires 44)',
    source: 'OpenF1 API'
  },
  
  // Historical Data
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
  {
    command: '/fastest <year> <round>',
    description: 'Get fastest laps from a race (e.g., /fastest 2023 1)',
    source: 'F1 Racing Results API'
  },
  {
    command: '/sprint <year> <round>',
    description: 'Get sprint race results (e.g., /sprint 2023 1)',
    source: 'F1 Racing Results API'
  }
];