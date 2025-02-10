'use client'

import { CommandFunction } from './index';
import { paceAnalysis } from './analysis/pace';
import { gapAnalysis } from './analysis/gap';

interface AnalysisCommands {
  [key: string]: CommandFunction;
}

export const analysisCommands: AnalysisCommands = {
  '/pace': paceAnalysis,
  '/gap': gapAnalysis
};