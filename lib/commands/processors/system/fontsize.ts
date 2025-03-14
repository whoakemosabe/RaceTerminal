import { CommandFunction } from '../index';

interface FontsizeCommands {
  [key: string]: CommandFunction;
}

export const fontsizeCommands: FontsizeCommands = {
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
  }
};