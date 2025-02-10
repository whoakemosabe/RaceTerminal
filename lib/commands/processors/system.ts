import { LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';
import { teamThemes, teamNicknames, icons, findTeamId, countryToCode } from '@/lib/utils';
import { commands } from '@/lib/commands';
import { APP_VERSION } from '@/lib/constants';

import { CommandFunction } from './index';

interface SystemCommands {
  [key: string]: CommandFunction;
}

export const systemCommands: SystemCommands = {
  '/user': async (args: string[], originalCommand: string) => {
    if (!args[0]) {
      const cmd = originalCommand === '/u' ? '/u' : '/user';
      return `❌ Error: Please provide a username or "reset" (e.g., ${cmd} max or ${cmd} reset)`;
    }
    
    const newUsername = args[0].trim();

    // Handle reset command
    if (newUsername.toLowerCase() === 'reset') {
      try {
        // Clear command history first
        localStorage.removeItem('commandHistory');
        window.dispatchEvent(new CustomEvent('clearTerminal'));
        
        // Then reset username
        localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME);
        window.dispatchEvent(new CustomEvent('usernameChange', { 
          detail: DEFAULT_USERNAME,
          bubbles: true,
          composed: true
        }));
        return `✨ Terminal reset complete!\n• Username reset to "${DEFAULT_USERNAME}"\n• Command history cleared`;
      } catch (error) {
        console.error('Failed to reset username:', error);
        return '❌ Error: Failed to reset username. Please try again.';
      }
    }

    if (newUsername.length < 2 || newUsername.length > 20) {
      return '❌ Error: Username must be between 2 and 20 characters';
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(newUsername)) {
      return '❌ Error: Username can only contain letters, numbers, underscores, and hyphens';
    }
    
    try {
      localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, newUsername);
      window.dispatchEvent(new CustomEvent('usernameChange', { 
        detail: newUsername,
        bubbles: true,
        composed: true
      }));
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('showWelcome'));
      }, 100);
      return `Username successfully changed to "${newUsername}"`;
    } catch (error) {
      console.error('Failed to save username:', error);
      return '❌ Error: Failed to save username. Please try again.';
    }
  },

  '/theme': async (args: string[]) => {
    if (!args[0]) {
      const teamList = Object.entries(teamNicknames)
        .map(([id, names]) => {
          const teamName = names[0];
          const teamColor = getTeamColor(teamName);
          return `• <span style="color: ${teamColor}">${teamName}</span>`;
        })
        .join('\n');
      
      return `❌ Error: Please provide a team name\nUsage: /theme <team> (e.g., /theme ferrari)\n\nAvailable themes:\n${teamList}\n\nOr use "/theme default" to reset to original theme`;
    }

    if (args[0].toLowerCase() === 'default') {
      document.documentElement.style.setProperty('--primary', '186 100% 50%');
      document.documentElement.style.setProperty('--secondary', '288 100% 73%');
      document.documentElement.style.setProperty('--accent', '288 100% 73%');
      document.documentElement.style.setProperty('--border', '186 100% 50%');
      localStorage.removeItem('terminal_theme');
      return '🎨 Terminal theme reset to default colors!';
    }

    const teamId = findTeamId(args[0]);
    if (!teamId) {
      return `❌ Error: Team "${args[0]}" not found. Try using the team name (e.g., ferrari, mercedes)`;
    }

    const theme = teamThemes[teamId];
    if (!theme) {
      return `❌ Error: No theme available for ${teamNicknames[teamId][0]}`;
    }

    try {
      document.documentElement.style.setProperty('--primary', theme.primary);
      document.documentElement.style.setProperty('--secondary', theme.secondary);
      document.documentElement.style.setProperty('--accent', theme.accent);
      document.documentElement.style.setProperty('--border', theme.border);
      
      localStorage.setItem('terminal_theme', teamId);
      
      return `🎨 Terminal theme changed to ${teamNicknames[teamId][0]} colors!`;
    } catch (error) {
      console.error('Failed to set theme:', error);
      return '❌ Error: Failed to apply theme. Please try again.';
    }
  },

  '/help': async (args: string[]) => {
    // Command-specific help documentation
    const commandHelp: Record<string, string> = {
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
      'Driver & Team': commands.filter(c => 
        ['driver', 'team', 'compare', '/md', '/mt'].some(term => 
          c.command.toLowerCase().includes(term)
        )
      ),
      'System': commands.filter(c => 
        ['user', 'clear', 'help', 'theme', 'sys', 'neofetch', 'hack', 'fontsize', 'stats', 'speed', 'decrypt'].some(term => 
          c.command.toLowerCase().includes(term)
        )
      ),
      'Effects': commands.filter(c => 
        ['retro', 'matrix', 'crt', 'glitch', 'scanlines', 'rain'].some(term => 
          c.command.toLowerCase().includes(term)
        )
      )
    };

    // If a specific command is provided
    if (args[0]) {
      const searchTerm = args[0].toLowerCase().replace('/', '');
      
      // Check for direct command help
      if (commandHelp[searchTerm]) {
        return commandHelp[searchTerm];
      }

      // Check for category help
      const category = Object.entries(categories).find(([name]) => 
        name.toLowerCase().includes(searchTerm)
      );

      if (category) {
        return [
          `📚 ${category[0].toUpperCase()} COMMANDS`,
          '═'.repeat(50),
          '',
          ...category[1].map(formatCommand)
        ].join('\n');
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
      'Type /help <category> for detailed information about a specific category.',
      'For example: /help live or /help driver',
      ''
    ];

    const formatCommand = (cmd: typeof commands[0]) => {
      const [baseCmd, ...params] = cmd.command.split(' ');
      const aliases = baseCmd.match(/\((.*?)\)/)?.[1] || '';
      const cleanCmd = baseCmd.replace(/\s*\(.*?\)/, '');
      
      return [
        `${cleanCmd}${params.length ? ' ' + params.join(' ') : ''}`,
        aliases ? `Aliases: ${aliases}` : '',
        `Description: ${cmd.description}`,
        `Source: ${cmd.source}`,
        ''
      ].filter(Boolean).join('\n');
    };

    // If a specific category is provided
    if (args[0]) {
      const category = Object.entries(categories).find(([name]) => 
        name.toLowerCase().includes(args[0].toLowerCase())
      );

      if (!category) {
        return [
          '❌ Category not found. Available categories:',
          ...Object.keys(categories).map(cat => `• ${cat} (/help ${cat.toLowerCase().split(' ')[0]})`)
        ].join('\n');
      }

      return [
        `📚 ${category[0].toUpperCase()} COMMANDS`,
        '═'.repeat(50),
        '',
        ...category[1].map(formatCommand)
      ].join('\n');
    }

    // Show all categories with their commands
    const content = Object.entries(categories).map(([category, cmds]) => [
      `${category} (${cmds.length} commands):`,
      '─'.repeat(25),
      ...cmds.map(cmd => {
        const [baseCmd] = cmd.command.split(' ');
        const cleanCmd = baseCmd.replace(/\s*\(.*?\)/, '');
        const aliases = baseCmd.match(/\((.*?)\)/)?.[1];
        return `${cleanCmd}${aliases ? ` (${aliases})` : ''} - ${cmd.description}`;
      }),
      ''
    ]).flat();

    return [
      ...header,
      ...content,
      'Tips:',
      '• Use /list <type> to see available data (drivers, teams, tracks, cars)',
      '• Use Tab for command completion',
      '• Commands are case-insensitive',
      '• Most commands have shortcuts (shown in parentheses)',
      '• Press Alt+Enter to toggle fullscreen mode',
      '• Press Ctrl+L to clear the terminal'
    ].join('\n');
  },

  '/clear': async () => {
    window.dispatchEvent(new CustomEvent('clearTerminal'));
    return '🧹 Terminal history cleared';
  },

  '/reset': async () => {
    localStorage.removeItem('commandHistory');
    localStorage.removeItem('terminal_theme');
    return null;
  },

  '/sys': async () => {
    const startTime = localStorage.getItem('session_start_time');
    const uptime = startTime ? 
      Math.floor((Date.now() - parseInt(startTime)) / 1000) : 0;
    
    const minutes = Math.floor(uptime / 60);
    const seconds = uptime % 60;
    
    const effects = [
      localStorage.getItem('retro_text_enabled') === 'true' ? 'Retro Text' : null,
      localStorage.getItem('matrix_enabled') === 'true' ? 'Matrix' : null,
      localStorage.getItem('scanlines_enabled') === 'true' ? 'Scanlines' : null,
      document.documentElement.classList.contains('crt-enabled') ? 'CRT' : null
    ].filter(Boolean);

    return [
      '🖥️  SYSTEM DIAGNOSTICS',
      '═'.repeat(50),
      `${icons.activity} Status: ONLINE`,
      `⏱️  Uptime: ${minutes}m ${seconds}s`,
      `🎨 Theme: ${localStorage.getItem('terminal_theme') || 'Default'}`,
      `📊 Font Size: ${localStorage.getItem('terminal_font_size') || '14'}px`,
      `✨ Active Effects: ${effects.length ? effects.join(', ') : 'None'}`,
      `🔋 Memory Usage: ${Math.round(performance.memory?.usedJSHeapSize / 1024 / 1024)}MB / ${Math.round(performance.memory?.jsHeapSizeLimit / 1024 / 1024)}MB`,
      `🌐 User Agent: ${navigator.userAgent}`,
      `🎯 Screen Resolution: ${window.screen.width}x${window.screen.height}`,
      `🔒 Protocol: ${window.location.protocol}`,
      `📡 Connection: ${navigator.onLine ? 'Online' : 'Offline'}`
    ].join('\n');
  },

  '/hack': async (args: string[]) => {
    if (!args[0]) {
      return '❌ Error: Please specify a target (e.g., /hack mainframe)';
    }

    const target = args[0].toLowerCase();
    const steps = [
      'Initializing breach protocol...',
      'Bypassing security measures...',
      'Injecting payload...',
      'Decrypting access codes...',
      'Establishing secure connection...',
      'Extracting data packets...',
      'Covering tracks...'
    ];

    let output = `🔓 INITIATING HACK SEQUENCE: ${target.toUpperCase()}\n`;
    output += '═'.repeat(50) + '\n\n';

    for (const step of steps) {
      output += `[${new Date().toLocaleTimeString()}] ${step}\n`;
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    output += '\n✅ Hack complete! Access granted to ' + target;
    return output;
  },

  '/glitch': async () => {
    document.documentElement.classList.add('glitch-active');
    setTimeout(() => {
      document.documentElement.classList.remove('glitch-active');
    }, 2000);
    return '👾 Initiating glitch sequence...';
  },

  '/crt': async () => {
    const isEnabled = document.documentElement.classList.toggle('crt-enabled');
    localStorage.setItem('crt_enabled', isEnabled.toString());
    return isEnabled
      ? '📺 CRT effects enabled. Welcome to the 80s!'
      : '📺 CRT effects disabled. Back to the future!';
  },

  '/neofetch': async () => {
    const os = 'RaceTerminal Pro';
    const kernel = 'v1.5a';
    const uptime = Math.floor((Date.now() - (parseInt(localStorage.getItem('session_start_time') || Date.now().toString()))) / 1000);
    const packages = Object.keys(commands).length;
    const shell = 'Race Shell';
    const resolution = `${window.innerWidth}x${window.innerHeight}`;
    const theme = localStorage.getItem('terminal_theme') || 'Default';


    const logo = `
<span style="color: hsl(var(--primary))">🏎️  RACE</span><span style="color: hsl(var(--secondary))">TERMINAL</span> <span style="color: hsl(var(--accent))">PRO</span>

<span style="color: hsl(var(--primary))">╔═══════════════════════╗</span>
<span style="color: hsl(var(--primary))">║</span> <span style="color: hsl(var(--secondary))">🏁 High Performance</span>   <span style="color: hsl(var(--primary))">║</span>
<span style="color: hsl(var(--primary))">║</span> <span style="color: hsl(var(--accent))">⚡ Maximum Speed</span>      <span style="color: hsl(var(--primary))">║</span>
<span style="color: hsl(var(--primary))">║</span> <span style="color: hsl(var(--secondary))">🔧 Full Control</span>       <span style="color: hsl(var(--primary))">║</span>
<span style="color: hsl(var(--primary))">╚═══════════════════════╝</span>`;

    return [
      logo,
      '',
      `OS: ${os}`,
      `Kernel: ${kernel}`,
      `Uptime: ${Math.floor(uptime / 60)}m ${uptime % 60}s`,
      `Packages: ${packages}`,
      `Shell: ${shell}`,
      `Resolution: ${resolution}`,
      `Theme: ${theme}`,
      `Terminal: RaceTerm ${APP_VERSION}`,
      `CPU: WebContainer v8`,
      `Memory: ${Math.round(performance.memory?.usedJSHeapSize / 1024 / 1024)}MB / ${Math.round(performance.memory?.jsHeapSizeLimit / 1024 / 1024)}MB`
    ].join('\n');
  }
};