import { LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';
import { teamThemes, teamNicknames, icons, findTeamId, countryToCode } from '@/lib/utils';
import { commands } from '@/lib/commands';
import { APP_VERSION } from '@/lib/constants';

import { CommandFunction } from './index';

interface SystemCommands {
  [key: string]: CommandFunction;
}

import { colorThemes } from '@/lib/themes/colors';
import { calculatorThemes } from '@/lib/themes/calculator';

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
      // Show both team themes and color themes
      const teamList = Object.entries(teamNicknames)
        .map(([id, names]) => {
          const teamName = names[0];
          const teamColor = getTeamColor(teamName);
          return `• <span style="color: ${teamColor}">${teamName}</span>`;
        });
      
      const colorList = Object.keys(colorThemes)
        .map(name => `• ${name}`);
      
      return [
        '❌ Error: Please provide a theme name',
        'Usage: /theme <name> (e.g., /theme ferrari or /theme dracula)',
        '',
        'F1 Team Themes:',
        '═'.repeat(20),
        teamList.join('\n'),
        '',
        'Color Themes:',
        '═'.repeat(20),
        colorList.join('\n'),
        '',
        'Calculator Mode:',
        '═'.repeat(20),
        '• Use /theme calc <scheme> for calculator themes',
        '  Available schemes: classic, blue, amber, red, white',
        '',
        'Reset to Default:',
        '• /theme default'
      ].join('\n');
    }

    // Handle calculator mode
    if (args[0].toLowerCase() === 'calc') {
      const scheme = args[1]?.toLowerCase();
      const validCalcSchemes = Object.keys(calculatorThemes);

      if (!scheme || !validCalcSchemes.includes(scheme)) {
        const calcSchemes = validCalcSchemes.map(name => `• ${name}`).join('\n');
        return [
          '❌ Error: Invalid calculator scheme',
          'Usage: /theme calc <scheme>',
          '',
          'Available Calculator Schemes:',
          calcSchemes
        ].join('\n');
      }

      try {
        // Enable calculator mode
        document.documentElement.classList.add('calculator-enabled');

        // Apply calculator theme
        const theme = calculatorThemes[scheme];
        Object.entries(theme).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--calc-${key}`, value);
        });

        localStorage.setItem('calculator_color_scheme', scheme);
        return `🖩 Calculator mode enabled with ${scheme} LCD theme!`;
      } catch (error) {
        console.error('Failed to apply calculator theme:', error);
        return '❌ Error: Failed to apply calculator theme';
      }
    }

    if (args[0].toLowerCase() === 'default') {
      document.documentElement.style.setProperty('--primary', '186 100% 50%');
      document.documentElement.style.setProperty('--secondary', '288 100% 73%');
      document.documentElement.style.setProperty('--accent', '288 100% 73%');
      document.documentElement.style.setProperty('--border', '186 100% 50%');
      document.documentElement.style.setProperty('--background', '0 0% 0%');
      document.documentElement.style.setProperty('--foreground', '210 40% 98%');
      document.documentElement.style.setProperty('--card', '0 0% 4%');
      document.documentElement.style.setProperty('--card-foreground', '210 40% 98%');
      document.documentElement.style.setProperty('--popover', '0 0% 4%');
      document.documentElement.style.setProperty('--popover-foreground', '210 40% 98%');
      document.documentElement.style.setProperty('--muted', '217.2 32.6% 17.5%');
      document.documentElement.style.setProperty('--muted-foreground', '215 20.2% 65.1%');
      localStorage.removeItem('terminal_theme');
      return '🎨 Terminal theme reset to default colors!';
    }

    // Check for VSCode theme
    const colorTheme = colorThemes[args[0].toLowerCase()];
    if (colorTheme) {
      try {
        // Apply VSCode theme colors
        document.documentElement.style.setProperty('--background', `${colorTheme.background}`);
        document.documentElement.style.setProperty('--card', `${colorTheme.background}`);
        document.documentElement.style.setProperty('--popover', `${colorTheme.background}`);
        document.documentElement.style.setProperty('--foreground', colorTheme.foreground);
        document.documentElement.style.setProperty('--primary-foreground', colorTheme.foreground);
        document.documentElement.style.setProperty('--secondary-foreground', colorTheme.foreground);
        document.documentElement.style.setProperty('--accent-foreground', colorTheme.foreground);
        document.documentElement.style.setProperty('--card-foreground', colorTheme.foreground);
        document.documentElement.style.setProperty('--popover-foreground', colorTheme.foreground);
        document.documentElement.style.setProperty('--primary', colorTheme.primary);
        document.documentElement.style.setProperty('--secondary', colorTheme.secondary);
        document.documentElement.style.setProperty('--accent', colorTheme.accent);
        document.documentElement.style.setProperty('--muted', colorTheme.muted);
        document.documentElement.style.setProperty('--muted-foreground', colorTheme.foreground);
        document.documentElement.style.setProperty('--border', colorTheme.border);

        // Update history colors
        document.documentElement.style.setProperty('--history-bg', `hsl(${colorTheme.background})`);
        document.documentElement.style.setProperty('--history-fg', `hsl(${colorTheme.foreground})`);
        document.documentElement.style.setProperty('--history-primary', `hsl(${colorTheme.primary})`);
        document.documentElement.style.setProperty('--history-secondary', `hsl(${colorTheme.secondary})`);
        document.documentElement.style.setProperty('--history-accent', `hsl(${colorTheme.accent})`);
        document.documentElement.style.setProperty('--history-muted', `hsl(${colorTheme.muted})`);
        document.documentElement.style.setProperty('--history-border', `hsl(${colorTheme.border})`);
        
        localStorage.setItem('terminal_theme', args[0].toLowerCase());
        return `🎨 Terminal theme changed to ${args[0]} colors!`;
      } catch (error) {
        console.error('Failed to apply theme:', error);
        return '❌ Error: Failed to apply theme';
      }
    }

    // Check for team theme
    const teamId = findTeamId(args[0]);
    if (!teamId) {
      return `❌ Error: Theme "${args[0]}" not found. Try using:\n• Team name (e.g., ferrari)\n• Color theme (e.g., dracula)\n• Calculator theme (e.g., theme calc amber)`;
    }

    const theme = teamThemes[teamId];
    if (!theme) {
      return `❌ Error: No theme available for ${teamNicknames[teamId][0]}`;
    }

    try {
      // Reset to default background colors first
      document.documentElement.style.setProperty('--background', '0 0% 0%');
      document.documentElement.style.setProperty('--card', '0 0% 4%');
      document.documentElement.style.setProperty('--popover', '0 0% 4%');
      
      // Set theme colors
      document.documentElement.style.setProperty('--primary', theme.primary);
      document.documentElement.style.setProperty('--secondary', theme.secondary);
      document.documentElement.style.setProperty('--primary-foreground', '210 40% 98%');
      document.documentElement.style.setProperty('--secondary-foreground', '210 40% 98%');
      document.documentElement.style.setProperty('--accent-foreground', '210 40% 98%');
      document.documentElement.style.setProperty('--accent', theme.accent);
      document.documentElement.style.setProperty('--border', theme.border);
      document.documentElement.style.setProperty('--foreground', '210 40% 98%');
      document.documentElement.style.setProperty('--card-foreground', '210 40% 98%');
      document.documentElement.style.setProperty('--popover-foreground', '210 40% 98%');
      document.documentElement.style.setProperty('--muted', '217.2 32.6% 17.5%');
      document.documentElement.style.setProperty('--muted-foreground', '215 20.2% 65.1%');

      // Update history colors
      document.documentElement.style.setProperty('--history-bg', '0 0% 0%');
      document.documentElement.style.setProperty('--history-fg', '210 40% 98%');
      document.documentElement.style.setProperty('--history-primary', `hsl(${theme.primary})`);
      document.documentElement.style.setProperty('--history-secondary', `hsl(${theme.secondary})`);
      document.documentElement.style.setProperty('--history-accent', `hsl(${theme.accent})`);
      document.documentElement.style.setProperty('--history-muted', 'hsl(217.2 32.6% 17.5%)');
      document.documentElement.style.setProperty('--history-border', `hsl(${theme.border})`);
      
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
      'colors': [
        '🎨 CALCULATOR COLOR SCHEMES REFERENCE',
        '═'.repeat(50),
        '',
        'Change calculator display color scheme.',
        '',
        'Usage: /colors calc [scheme]',
        'Example: /colors calc amber',
        '',
        'Available Schemes:',
        '• classic - Classic green LCD display',
        '• blue   - Cool blue LCD screen',
        '• amber  - Warm amber display',
        '• red    - Red LED display',
        '• white  - Modern LCD look',
        '',
        'Features:',
        '• Multiple color themes',
        '• Authentic LCD styling',
        '• Customizable text colors',
        '• Scan line effects',
        '',
        'Notes:',
        '• Each scheme has unique colors for:',
        '  - Background',
        '  - Text output',
        '  - Commands',
        '  - Timestamps',
        '  - Prompts',
        '',
        'Related Commands:',
        '• /calc - Toggle calculator mode',
        '• /theme - Change terminal theme',
        '• /retro - Retro text effects'
      ].join('\n'),

      'calculator': [
        '🖩 CALCULATOR MODE REFERENCE',
        '═'.repeat(50),
        '',
        'Enable retro calculator LCD display mode.',
        '',
        'Usage:',
        '1. Basic toggle: /calc',
        '2. With colors: /colors calc [scheme]',
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
        '• /colors calc - Change calculator colors',
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
        '• Shows performance metrics',
        '',
        'Related Commands:',
        '• /sys - System diagnostics',
        '• /clear - Clear history',
        '• /neofetch - System info'
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
      ).concat(commands.filter(c => 
        ['calc', 'calculator'].some(term => 
          c.command.toLowerCase().includes(term)
        )
      ))
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

  '/fontsize': async (args: string[]) => {
    if (!args[0]) {
      return '❌ Error: Please provide a size or action\nUsage:\n• /fontsize <number> (e.g., /fontsize 14)\n• /fontsize + (increase size)\n• /fontsize - (decrease size)\n• /fontsize reset (default size)';
    }

    const currentSize = parseInt(localStorage.getItem('terminal_font_size') || '14', 10);
    let newSize = currentSize;

    if (args[0] === 'reset') {
      newSize = 14;
    } else if (args[0] === '+') {
      newSize = Math.min(currentSize + 2, 24);
    } else if (args[0] === '-') {
      newSize = Math.max(currentSize - 2, 10);
    } else {
      const size = parseInt(args[0]);
      if (isNaN(size) || size < 10 || size > 24 || !Number.isInteger(size)) {
        return '❌ Error: Font size must be between 10 and 24';
      }
      newSize = size;
    }

    try {
      localStorage.setItem('terminal_font_size', newSize.toString());
      // Dispatch event to update font size in real-time
      window.dispatchEvent(new CustomEvent('fontSizeChange', {
        detail: newSize,
        bubbles: true,
        composed: true
      }));
      
      // Update CSS variable directly for immediate effect
      document.documentElement.style.setProperty('--terminal-font-size', `${newSize}px`);
      
      return `📊 Font size changed to ${newSize}px`;
    } catch (error) {
      console.error('Failed to change font size:', error);
      return '❌ Error: Failed to change font size';
    }
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