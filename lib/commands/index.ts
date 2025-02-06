export const commands = [
  // System Commands
  {
    command: '/list (/ls) <type>',
    description: 'List available drivers, teams, or tracks',
    source: 'System'
  },
  {
    command: '/list (/ls)',
    description: 'List available drivers, teams, or tracks',
    source: 'System'
  },
  {
    command: '/help (/h)',
    description: 'Show help and available commands',
    source: 'System'
  },
  {
    command: '/user <name|reset> (/u)',
    description: 'Change your terminal display name or reset to default',
    source: 'System'
  },
  {
    command: '/clear',
    description: 'Clear the terminal history (alias: Ctrl+L)',
    source: 'System'
  },
  
  // Driver & Team Commands
  { 
    command: '/driver <name> (/d)', 
    description: 'Get detailed driver information and stats',
    source: 'Ergast F1 API'
  },
  {
    command: '/team <name>',
    description: 'Get constructor/team information and history',
    source: 'Ergast F1 API'
  },
  {
    command: '/compare <type> <name1> <name2> (/m)',
    description: 'Compare career stats between drivers or teams',
    source: 'Ergast F1 API'
  },
  
  // Race Information
  { 
    command: '/standings (/s)', 
    description: 'View current drivers championship standings',
    source: 'Ergast F1 API'
  },
  {
    command: '/teams (/c)',
    description: 'View current constructor championship standings',
    source: 'Ergast F1 API'
  },
  { 
    command: '/schedule (/sc)', 
    description: 'View upcoming race schedule and dates',
    source: 'Ergast F1 API'
  },
  {
    command: '/next (/n)',
    description: 'Get details and countdown for the next race',
    source: 'Ergast F1 API'
  },
  {
    command: '/last',
    description: 'Get results from the most recent race',
    source: 'Ergast F1 API'
  },
  { 
    command: '/track <name> (/t)', 
    description: 'Get detailed circuit information and facts',
    source: 'Ergast F1 API'
  },
  
  // Live Session Data
  { 
    command: '/live (/l)', 
    description: 'Get real-time timing data during sessions',
    source: 'OpenF1 API'
  },
  {
    command: '/telemetry <number>',
    description: 'Get real-time car telemetry data by driver number',
    source: 'OpenF1 API'
  },
  {
    command: '/status',
    description: 'Get current track status and race control info',
    source: 'OpenF1 API'
  },
  {
    command: '/weather (/w)',
    description: 'Get current weather conditions at the circuit',
    source: 'OpenF1 API'
  },
  {
    command: '/tires <number>',
    description: 'Get tire compound and wear data by driver number',
    source: 'OpenF1 API'
  },
  
  // Historical Data
  { 
    command: '/race <year> [round] (/r)', 
    description: 'Get historical race results by year and round',
    source: 'F1 Racing Results API'
  },
  { 
    command: '/qualifying <year> <round> (/q)', 
    description: 'Get qualifying session results by year and round',
    source: 'F1 Racing Results API'
  },
  { 
    command: '/laps <year> <round> [driver]', 
    description: 'Get detailed lap times from a specific race',
    source: 'F1 Racing Results API'
  },
  { 
    command: '/pitstops <year> <round> (/p)', 
    description: 'Get pit stop timings and strategies',
    source: 'F1 Racing Results API'
  },
  {
    command: '/fastest <year> <round> (/f)',
    description: 'Get fastest lap records from a specific race',
    source: 'F1 Racing Results API'
  },
  {
    command: '/sprint <year> <round>',
    description: 'Get sprint race results and statistics',
    source: 'F1 Racing Results API'
  }
];