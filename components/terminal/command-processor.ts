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
  '/fl': '/fastest',
  '/ql': '/qualifying',
  '/nx': '/next',
  '/rs': '/reset',
  '/sc': '/schedule',
  '/sp': '/sprint',
  '/tr': '/track',
  '/tm': '/team',
  '/wx': '/weather'
};

export { processCommand } from '@/lib/commands/processors';