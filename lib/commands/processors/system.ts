import { LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';
import { teamThemes, teamNicknames, icons, findTeamId, countryToCode } from '@/lib/utils';
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
      `Shell: ${shell}`,
      `Resolution: ${resolution}`,
      `Theme: ${theme}`,
      `Terminal: RaceTerm ${APP_VERSION}`,
      `CPU: WebContainer v8`,
      `Memory: ${Math.round(performance.memory?.usedJSHeapSize / 1024 / 1024)}MB / ${Math.round(performance.memory?.jsHeapSizeLimit / 1024 / 1024)}MB`
    ].join('\n');
  }
};