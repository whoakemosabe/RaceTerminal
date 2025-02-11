import { CommandFunction } from './index';

interface EffectsCommands {
  [key: string]: CommandFunction;
}

const effectsCommands: EffectsCommands = {
  '/retro': async (args: string[], originalCommand: string) => {
    if (args.length > 0 && !['reset', 'all'].includes(args[0].toLowerCase())) {
      return '❌ Error: /retro only accepts "all" or "reset" as arguments (e.g., /retro all or /retro reset)';
    }

    if (args[0]?.toLowerCase() === 'all') {
      try {
        // Enable all effects
        document.documentElement.classList.add(
          'retro-text-enabled',
          'matrix-enabled',
          'matrix-rain-enabled',
          'scanlines-enabled',
          'crt-enabled'
        );
        document.documentElement.classList.remove('retro-text-disabled');
        
        // Save effect states
        localStorage.setItem('retro_text_enabled', 'true');
        localStorage.setItem('matrix_enabled', 'true');
        localStorage.setItem('matrix_rain_enabled', 'true');
        localStorage.setItem('scanlines_enabled', 'true');
        localStorage.setItem('crt_enabled', 'true');
        
        return '✨ All terminal effects have been enabled!\n' +
               '• Retro text: enabled\n' +
               '• Matrix effects: enabled\n' +
               '• CRT effects: enabled\n' +
               '• Scanlines: enabled\n' +
               '• Digital rain: enabled';
      } catch (error) {
        console.error('Failed to enable all effects:', error);
        return '❌ Error: Failed to enable effects. Please try again.';
      }
    }

    if (args[0]?.toLowerCase() === 'reset') {
      try {
        // Remove all effect classes
        document.documentElement.classList.remove(
          'retro-text-enabled',
          'retro-text-disabled',
          'matrix-enabled',
          'matrix-rain-enabled',
          'scanlines-enabled',
          'crt-enabled',
          'glitch-active'
        );
        
        // Clear all effect states from localStorage
        localStorage.removeItem('retro_text_enabled');
        localStorage.removeItem('matrix_enabled');
        localStorage.removeItem('matrix_rain_enabled');
        localStorage.removeItem('scanlines_enabled');
        localStorage.removeItem('crt_enabled');
        
        return '✨ All terminal effects have been reset!\n' +
               '• Retro text: disabled\n' +
               '• Matrix effects: disabled\n' +
               '• CRT effects: disabled\n' +
               '• Scanlines: disabled\n' +
               '• Digital rain: disabled';
      } catch (error) {
        console.error('Failed to reset effects:', error);
        return '❌ Error: Failed to reset effects. Please try again.';
      }
    }

    const currentState = localStorage.getItem('retro_text_enabled');
    const newState = currentState === 'true' ? 'false' : 'true';
  
    try {
      localStorage.setItem('retro_text_enabled', newState);
      document.documentElement.classList.remove('retro-text-enabled', 'retro-text-disabled');
      document.documentElement.classList.add(newState === 'true' ? 'retro-text-enabled' : 'retro-text-disabled');
    
      return newState === 'true' 
        ? '✨ Retro text effect enabled!'
        : '✨ Retro text effect disabled. Terminal text will be normal.';
    } catch (error) {
      console.error('Failed to toggle retro effect:', error);
      return '❌ Error: Failed to toggle retro effect. Please try again.';
    }
  },

  '/matrix': async (args: string[], originalCommand: string) => {
    if (args.length > 0) {
      return '❌ Error: /matrix is a simple toggle command and does not accept any arguments';
    }

    const currentState = document.documentElement.classList.contains('matrix-enabled');
    try {
      document.documentElement.classList.toggle('matrix-enabled');
      localStorage.setItem('matrix_enabled', (!currentState).toString());
      return !currentState
        ? '🟢 Matrix effect enabled! Welcome to the digital world...'
        : '🟢 Matrix effect disabled. Back to reality!';
    } catch (error) {
      console.error('Failed to toggle matrix effect:', error);
      return '❌ Error: Failed to toggle matrix effect. Please try again.';
    }
  },

  '/matrix rain': async (args: string[], originalCommand: string) => {
    if (args.length > 0) {
      return '❌ Error: /matrix rain is a simple toggle command and does not accept any arguments';
    }

    const currentState = document.documentElement.classList.contains('matrix-rain-enabled');
    try {
      document.documentElement.classList.toggle('matrix-rain-enabled');
      localStorage.setItem('matrix_rain_enabled', (!currentState).toString());
      return !currentState
        ? '🟢 Matrix rain effect enabled! Digital droplets falling...'
        : '🟢 Matrix rain effect disabled. Droplets stopped!';
    } catch (error) {
      console.error('Failed to toggle matrix rain effect:', error);
      return '❌ Error: Failed to toggle matrix rain effect. Please try again.';
    }
  },

  '/glitch': async (args: string[], originalCommand: string) => {
    if (args.length > 0) {
      return '❌ Error: /glitch is a simple toggle command and does not accept any arguments';
    }

    const currentState = document.documentElement.classList.contains('glitch-active');
    try {
      document.documentElement.classList.toggle('glitch-active');
      return !currentState
        ? '�itch Glitch effect enabled! Reality is breaking...'
        : '🌊 Glitch effect disabled. Reality stabilized.';
    } catch (error) {
      console.error('Failed to toggle glitch effect:', error);
      return '❌ Error: Failed to toggle glitch effect. Please try again.';
    }
  },

  '/crt': async (args: string[], originalCommand: string) => {
    if (args.length > 0) {
      return '❌ Error: /crt is a simple toggle command and does not accept any arguments';
    }

    const currentState = document.documentElement.classList.contains('crt-enabled');
    try {
      document.documentElement.classList.toggle('crt-enabled');
      localStorage.setItem('crt_enabled', (!currentState).toString());
      return !currentState
        ? '📺 CRT effects enabled! Welcome to the retro era!'
        : '📺 CRT effects disabled. Back to modern display!';
    } catch (error) {
      console.error('Failed to toggle CRT effect:', error);
      return '❌ Error: Failed to toggle CRT effect. Please try again.';
    }
  },

  '/scanlines': async (args: string[], originalCommand: string) => {
    if (args.length > 0) {
      return '❌ Error: /scanlines is a simple toggle command and does not accept any arguments';
    }

    const currentState = document.documentElement.classList.contains('scanlines-enabled');
    try {
      document.documentElement.classList.toggle('scanlines-enabled');
      localStorage.setItem('scanlines_enabled', (!currentState).toString());
      return !currentState
        ? '📺 CRT scanlines effect enabled! Old school vibes...'
        : '📺 CRT scanlines effect disabled. Back to HD!';
    } catch (error) {
      console.error('Failed to toggle scanlines effect:', error);
      return '❌ Error: Failed to toggle scanlines effect. Please try again.';
    }
  },

  '/calc': async (args: string[], originalCommand: string) => {
    if (args.length > 0) {
      return '❌ Error: /calc is a simple toggle command and does not accept any arguments';
    }

    const currentState = document.documentElement.classList.contains('calculator-enabled');
    try {
      document.documentElement.classList.toggle('calculator-enabled');
      localStorage.setItem('calculator_enabled', (!currentState).toString());
      
      // Apply default calculator theme (classic green)
      if (!currentState) {
        document.documentElement.style.setProperty('--calc-bg', '#c8d1c0');
        document.documentElement.style.setProperty('--calc-text', '#0d1f0c');
        document.documentElement.style.setProperty('--calc-accent', '#1f3d1a');
        document.documentElement.style.setProperty('--calc-timestamp', '#0f2f0c');
        document.documentElement.style.setProperty('--calc-prompt', '#1f3d1a');
        document.documentElement.style.setProperty('--calc-command', '#071505');
        document.documentElement.style.setProperty('--calc-output', '#0d1f0c');
      }
      
      return !currentState
        ? '🖩 Calculator mode enabled with classic green theme! Use /theme calc <scheme> to change colors.'
        : '🖩 Calculator mode disabled. Back to normal!';
    } catch (error) {
      console.error('Failed to toggle calculator mode:', error);
      return '❌ Error: Failed to toggle calculator mode. Please try again.';
    }
  }

};

export { effectsCommands };