import { api } from '@/lib/api/client';
import { getFlagUrl, getTeamColor } from '@/lib/utils';
import { CommandFunction } from '../index';
import { fastestLapCommand } from './fastest';

interface RaceCommands {
  [key: string]: CommandFunction;
}

export const raceCommands: RaceCommands = {
  '/race': async (args: string[], originalCommand: string) => {
    // ... existing race command implementation ...
  },
  '/qualifying': async (args: string[], originalCommand: string) => {
    // ... existing qualifying command implementation ...
  },
  '/sprint': async (args: string[], originalCommand: string) => {
    // ... existing sprint command implementation ...
  },
  '/pitstops': async (args: string[], originalCommand: string) => {
    // ... existing pitstops command implementation ...
  },
  '/fastest': fastestLapCommand,
  '/track': async (args: string[], originalCommand: string) => {
    // ... existing track command implementation ...
  },
  '/standings': async (args: string[], originalCommand: string) => {
    // ... existing standings command implementation ...
  },
  '/teams': async (args: string[], originalCommand: string) => {
    // ... existing teams command implementation ...
  },
  '/schedule': async (args: string[], originalCommand: string) => {
    // ... existing schedule command implementation ...
  },
  '/next': async (args: string[], originalCommand: string) => {
    // ... existing next command implementation ...
  },
  '/last': async (args: string[], originalCommand: string) => {
    // ... existing last command implementation ...
  },
  '/compare': async (args: string[], originalCommand: string) => {
    // ... existing compare command implementation ...
  }
};