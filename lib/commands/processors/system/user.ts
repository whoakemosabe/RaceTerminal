import { LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';
import { CommandFunction } from '../index';

interface UserCommands {
  [key: string]: CommandFunction;
}

export const userCommands: UserCommands = {
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
  }
};