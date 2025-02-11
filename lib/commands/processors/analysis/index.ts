import { CommandFunction } from '../index';
import { paceAnalysis } from './pace';
import { gapAnalysis } from './gap';
import { sectorAnalysis } from './sector';
import { overtakeAnalysis } from './overtake';
import { plotCommand } from './plot';

interface AnalysisCommands {
  [key: string]: CommandFunction;
}

export const analysisCommands: AnalysisCommands = {
  '/pace': paceAnalysis,
  '/gap': gapAnalysis,
  '/sector': sectorAnalysis,
  '/overtake': overtakeAnalysis,
  '/plot': plotCommand
};