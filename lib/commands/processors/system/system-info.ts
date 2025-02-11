import { icons } from '@/lib/utils';
import { APP_VERSION } from '@/lib/constants';
import { CommandFunction } from '../index';
import { commands } from '@/lib/commands';

interface SystemInfoCommands {
  [key: string]: CommandFunction;
}

export const systemInfoCommands: SystemInfoCommands = {
  '/sys': async () => {
    const os = 'RaceTerminal Pro';
    const kernel = 'v1.5a';
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

    const logo = `
<span style="color: hsl(var(--primary))">🏎️  RACE</span><span style="color: hsl(var(--secondary))">TERMINAL</span> <span style="color: hsl(var(--accent))">PRO</span>

<span style="color: hsl(var(--primary))">╔═══════════════════════╗</span>
<span style="color: hsl(var(--primary))">║</span> <span style="color: hsl(var(--secondary))">🏁 High Performance</span>   <span style="color: hsl(var(--primary))">║</span>
<span style="color: hsl(var(--primary))">║</span> <span style="color: hsl(var(--accent))">⚡ Maximum Speed</span>      <span style="color: hsl(var(--primary))">║</span>
<span style="color: hsl(var(--primary))">║</span> <span style="color: hsl(var(--secondary))">🔧 Full Control</span>       <span style="color: hsl(var(--primary))">║</span>
<span style="color: hsl(var(--primary))">╚═══════════════════════╝</span>`;

    const currentTheme = localStorage.getItem('terminal_theme') || 'Default';
    const currentFontSize = localStorage.getItem('terminal_font_size') || '14';
    const calcMode = document.documentElement.classList.contains('calculator-enabled');
    const calcTheme = localStorage.getItem('calculator_color_scheme') || 'classic';

    return [
      logo,
      '',
      '🖥️  SYSTEM DIAGNOSTICS',
      '═'.repeat(50),
      `${icons.activity} System Info`,
      `• OS: ${os}`,
      `• Kernel: ${kernel}`,
      `• Terminal: RaceTerm ${APP_VERSION}`,
      `• Shell: Race Shell`,
      '',
      '🎨 Theme & Display',
      `• Theme: ${currentTheme}`,
      `• Font Size: ${currentFontSize}px`,
      `• Calculator Mode: ${calcMode ? `Enabled (${calcTheme})` : 'Disabled'}`,
      `• Active Effects: ${effects.length ? effects.join(', ') : 'None'}`,
      '',
      '⚡ Performance',
      `• Uptime: ${minutes}m ${seconds}s`,
      `• Memory: ${Math.round(performance.memory?.usedJSHeapSize / 1024 / 1024)}MB / ${Math.round(performance.memory?.jsHeapSizeLimit / 1024 / 1024)}MB`,
      `• Resolution: ${window.screen.width}x${window.screen.height}`,
      '',
      '🔒 Environment',
      `• Protocol: ${window.location.protocol}`,
      `• Connection: ${navigator.onLine ? 'Online' : 'Offline'}`,
      `• User Agent: ${navigator.userAgent}`
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
  }
};