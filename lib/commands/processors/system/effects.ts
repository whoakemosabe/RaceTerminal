import { CommandFunction } from '../index';

interface EffectsCommands {
  [key: string]: CommandFunction;
}

export const effectsCommands: EffectsCommands = {
  '/matrix rain': async () => {
    const isEnabled = document.documentElement.classList.toggle('matrix-rain-enabled');
    localStorage.setItem('matrix_rain_enabled', isEnabled.toString());
    return isEnabled
      ? '🟢 Matrix rain effect enabled! Digital droplets falling...'
      : '🟢 Matrix rain effect disabled. Droplets stopped!';
  },

  '/scanlines': async () => {
    const isEnabled = document.documentElement.classList.toggle('scanlines-enabled');
    localStorage.setItem('scanlines_enabled', isEnabled.toString());
    return isEnabled
      ? '📺 CRT scanlines effect enabled! Old school vibes...'
      : '📺 CRT scanlines effect disabled. Back to HD!';
  },

  '/calc': async () => {
    const isEnabled = document.documentElement.classList.toggle('calculator-enabled');
    localStorage.setItem('calculator_enabled', isEnabled.toString());
    return isEnabled
      ? '🖩 Calculator screen effect enabled! Retro LCD vibes...'
      : '🖩 Calculator screen effect disabled. Back to normal!';
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
  }
};