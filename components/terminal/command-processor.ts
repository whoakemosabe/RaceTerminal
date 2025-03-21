// Command aliases mapping
export const commandAliases: Record<string, string> = {
  // Single letter shortcuts
  '/ls': '/list',
  '/d': '/driver',
  '/t': '/track',
  '/c': '/car',
  '/s': '/standings',     // Driver standings
  '/cl': '/clear',
  '/q': '/qualifying',
  '/r': '/race',
  '/n': '/next',
  '/l': '/live',
  '/w': '/weather',
  '/h': '/help',
  '/p': '/pitstops',
  '/f': '/fastest',
  '/u': '/user',
  '/m': '/compare',

  // Multi-letter shortcuts
  '/md': '/compare driver',
  '/mt': '/compare team',
  '/ds': '/standings',    // Driver standings
  '/cs': '/teams',        // Constructor standings
  '/ps': '/pitstops',
  '/tm': '/team',         // Team info
  '/fl': '/fastest',
  '/ql': '/qualifying',
  '/nx': '/next',
  '/rs': '/reset',
  '/sc': '/schedule',
  '/oa': '/overtake',     // Overtake analysis shortcut
  '/ov': '/overtake',     // Alternative overtake shortcut 
  '/sa': '/sector',       // Sector analysis shortcut
  '/sp': '/sprint',
  '/wx': '/weather'
};

export { processCommand } from '@/lib/commands/processors';