import { systemCommands } from './system';
import { driverCommands } from './driver';
import { raceCommands } from './race';
import { liveCommands } from './live';
import { effectsCommands } from './effects';
import { listCommands } from './list';
import { carCommands } from './cars';
import { commandAliases } from '@/components/terminal/command-processor';

// Command processor registry
const processors: Record<string, (args: string[], originalCommand: string) => Promise<string>> = {
  ...systemCommands,
  ...driverCommands,
  ...raceCommands,
  ...liveCommands,
  ...effectsCommands,
  ...listCommands,
  ...carCommands,
  '/standings': raceCommands['/standings'],
  '/teams': raceCommands['/teams'],
  '/schedule': raceCommands['/schedule'],
  '/next': raceCommands['/next'],
  '/last': raceCommands['/last'],
  '/track': raceCommands['/track'],
  '/qualifying': raceCommands['/qualifying'],
  '/sprint': raceCommands['/sprint'],
  '/pitstops': raceCommands['/pitstops'],
  '/fastest': raceCommands['/fastest'],
  '/compare': raceCommands['/compare'],
  '/matrix rain': effectsCommands['/matrix rain'],
  '/scanlines': effectsCommands['/scanlines'],
  '/glitch': effectsCommands['/glitch'],
  '/crt': effectsCommands['/crt'],
  '/neofetch': systemCommands['/neofetch'],
  '/hack': systemCommands['/hack'],
  '/sys': systemCommands['/sys']
};

export async function processCommand(cmd: string) {
  const parts = cmd.split(' ');
  let inputCommand = parts[0].toLowerCase();
  const originalCommand = inputCommand;
  let args = parts.slice(1).map(arg => arg.trim()).filter(Boolean);
  
  // Handle aliases
  const aliasedCommand = commandAliases[inputCommand];
  if (aliasedCommand) {
    const aliasedParts = aliasedCommand.split(' ');
    inputCommand = aliasedParts[0];
    
    // Handle /md and /mt shortcuts
    if (inputCommand === '/md') {
      if (args.length !== 2) {
        return '❌ Error: /md requires exactly two drivers\nUsage: /md <driver1> <driver2>\nExample: /md verstappen hamilton';
      }
      inputCommand = '/compare';
      args = ['driver', ...args];
    } else if (inputCommand === '/mt') {
      if (args.length !== 2) {
        return '❌ Error: /mt requires exactly two teams\nUsage: /mt <team1> <team2>\nExample: /mt redbull mercedes';
      }
      inputCommand = '/compare';
      args = ['team', ...args];
    } else if (aliasedParts.length > 1) {
      args.unshift(...aliasedParts.slice(1));
    }
  }

  try {
    const processor = processors[inputCommand];
    if (!processor) {
      return `❌ Error: Unknown command: ${originalCommand}\nType /help or /h to see all available commands and shortcuts.`;
    }
    
    return await processor(args, originalCommand);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Command error:', errorMessage);
    return '❌ Error: The service is temporarily unavailable. Please try again later.';
  }
}