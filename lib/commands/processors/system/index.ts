import { userCommands } from './user';
import { themeCommands } from './theme';
import { helpCommands, getShortDescription } from './help';
import { effectsCommands } from './effects';
import { systemInfoCommands } from './system-info';
import { CommandFunction } from '../index';

interface SystemCommands {
  [key: string]: CommandFunction;
}

// Combine all system-related commands
export const systemCommands: SystemCommands = {
  ...userCommands,
  ...themeCommands,
  ...helpCommands,
  ...effectsCommands,
  ...systemInfoCommands