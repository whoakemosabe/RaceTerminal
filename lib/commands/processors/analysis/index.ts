import { paceAnalysis } from './pace';
import { gapAnalysis } from './gap';
import { CommandFunction } from '../index';

interface AnalysisCommands {
  [key: string]: CommandFunction;
}

export const analysisCommands: AnalysisCommands = {
  '/pace': paceAnalysis,
  '/gap': gapAnalysis
};