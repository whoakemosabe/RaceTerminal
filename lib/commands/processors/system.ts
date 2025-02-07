import { LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';
import { teamThemes, teamNicknames, icons, findTeamId, countryToCode } from '@/lib/utils';
import { commands } from '@/lib/commands';
import { APP_VERSION } from '@/lib/constants';

export const systemCommands = {
  '/user': async (args: string[], originalCommand: string) => {
    if (!args[0]) {
      const cmd = originalCommand === '/u' ? '/u' : '/user';
      return `❌ Error: Please provide a username or "reset" (e.g., ${cmd} max or ${cmd} reset)`;
    }
    
    const newUsername = args[0].trim();

    // Handle reset command
    if (newUsername.toLowerCase() === 'reset') {
      try {
        localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME);
        window.dispatchEvent(new CustomEvent('usernameChange', { 
          detail: DEFAULT_USERNAME,
          bubbles: true,
          composed: true
        }));
        return `Username reset to "${DEFAULT_USERNAME}"`;
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

  '/help': async () => {
    // Help command implementation
    // (Moved to separate file for brevity)
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

    const logo = [
      '    ____              __________              _            __',
      '   / __ \\____ _____  / ____/ __/___ ___     (_)___  ____/ /',
      '  / /_/ / __ `/ __ \\/ /   / /_/ __ `__ \\   / / __ \\/ __  /',
      ' / _, _/ /_/ / /_/ / /___/ __/ / / / / /  / / / / / /_/ /',
      '/_/ |_|\\__,_/ .___/\\____/_/ /_/ /_/ /_/  /_/_/ /_/\\__,_/',
      '           /_/'
    ].join('\n');

    return [
      logo,
      '─'.repeat(50),
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