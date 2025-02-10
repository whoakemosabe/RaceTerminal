import { formatTime } from '@/lib/utils';
import { StintPerformance } from './types';

export function calculateTireScore(
  lapTimes: number[], 
  startPos: number, 
  finishPos: number, 
  stints: StintPerformance[],
  trend: number,
  index: number
): number {
  if (!lapTimes || lapTimes.length === 0) {
    return 5.0;
  }

  const weights = {
    stintLength: 0.30,
    consistency: 0.25,
    trend: 0.20,
    range: 0.10,
    position: 0.15
  };

  // Calculate stint length score
  const totalRaceLaps = Math.max(...stints.map(s => s.endLap));
  const expectedPitStops = Math.ceil(totalRaceLaps / 25);
  const targetStintLength = totalRaceLaps / (expectedPitStops + 1);
  
  const avgStintLength = stints.reduce((acc, stint) => acc + stint.laps, 0) / stints.length;
  const maxStintLength = Math.max(...stints.map(s => s.laps));
  
  const stintLengthScore = Math.min(10, (avgStintLength / targetStintLength) * 8.5);
  const longStintBonus = maxStintLength > targetStintLength ? 
    Math.min(1.5, (maxStintLength - targetStintLength) * 0.15) : 0;

  // Consistency score
  const consistencyScore = Math.min(10, stints.reduce((acc, stint) => {
    const degradation = (stint.worstLap - stint.bestLap) / stint.laps;
    const degradationThreshold = 0.08 * (1 + (stint.laps / targetStintLength));
    return acc + Math.max(0, 10 - (degradation / degradationThreshold) * 10);
  }, 0) / stints.length);

  // Trend score
  const trendScore = calculateTrendScore(trend, index);

  // Range score
  const totalRange = Math.max(...lapTimes) - Math.min(...lapTimes);
  const expectedRange = 1.5 + (index * 0.1);
  const rangeScore = Math.max(0, 10 - (totalRange / expectedRange) * 5);

  // Position change score
  const positionScore = calculatePositionScore(startPos, finishPos);

  // Combine scores
  let score = 
    ((stintLengthScore + longStintBonus) * weights.stintLength) +
    (consistencyScore * weights.consistency) +
    (trendScore * weights.trend) +
    (rangeScore * weights.range) +
    (positionScore * weights.position);

  // Position-based adjustments
  if (finishPos <= 3 && startPos <= 3) {
    score *= 1.08; // Maintained podium
  } else if (finishPos <= 3 && startPos > 3) {
    score *= 1.12; // Fought to podium
  } else if (finishPos <= 10 && startPos > 10) {
    score *= 1.05; // Fought into points
  }

  return score;
}

function calculateTrendScore(trend: number, index: number): number {
  const positionFactor = Math.max(0.8, 1 - (index * 0.02));
  const normalizedTrend = trend * positionFactor;
  
  if (normalizedTrend > 0) {
    return Math.max(0, 10 - (normalizedTrend * 4));
  } else {
    return Math.min(10, 8.5 + Math.abs(normalizedTrend * 3));
  }
}

function calculatePositionScore(startPos: number, finishPos: number): number {
  const positionsGained = startPos - finishPos;
  const baseScore = 7.0;
  
  if (positionsGained > 0) {
    return Math.min(10, baseScore + (positionsGained * 0.5));
  } else if (positionsGained < 0) {
    return Math.max(4, baseScore + (positionsGained * 0.4));
  }
  return baseScore;
}

export function getTrendIndicator(trend: number, finishPos: number, startPos: number): string {
  const variation = calculateTrendVariation(finishPos, startPos);
  
  if (finishPos === 1) {
    return getRaceWinnerTrend(trend);
  }
  
  if (finishPos <= 3) {
    return getPodiumTrend(trend);
  }
  
  return getGeneralTrend(trend, variation);
}

function calculateTrendVariation(finishPos: number, startPos: number): number {
  const positionsGained = startPos - finishPos;
  
  if (finishPos <= 3) {
    return positionsGained > 0 ? -0.05 : 0;
  }
  if (finishPos <= 10) {
    return positionsGained > 0 ? -0.02 : 0.02;
  }
  return positionsGained > 3 ? 0 : 0.15;
}

function getRaceWinnerTrend(trend: number): string {
  if (trend <= -0.3) return '💫 Exceptional Pace';
  if (trend <= -0.1) return '🟢 Strong Pace';
  if (trend <= 0.1) return '🟢 Consistent Pace';
  if (trend <= 0.3) return '🟡 Managed Pace';
  return '🟡 Conservative Pace';
}

function getPodiumTrend(trend: number): string {
  if (trend <= -0.2) return '💫 Strong Pace';
  if (trend <= 0.0) return '🟢 Competitive Pace';
  if (trend <= 0.2) return '🟢 Consistent Pace';
  if (trend <= 0.4) return '🟡 Managed Pace';
  return '🟡 Steady Pace';
}

function getGeneralTrend(trend: number, variation: number): string {
  const thresholds = {
    exceptional: -0.5 + variation,
    strong: -0.3 + variation,
    improving: -0.2 + variation,
    slight: -0.1 + variation,
    stable: 0.15 + variation,
    slightDecline: 0.3 + variation,
    declining: 0.5 + variation,
    strongDecline: 0.8 + variation
  };

  if (trend <= thresholds.exceptional) return '💫 Exceptional Improvement';
  if (trend <= thresholds.strong) return '🟢 Strong Improvement';
  if (trend <= thresholds.improving) return '🟢 Improving';
  if (trend <= thresholds.slight) return '🟡 Slight Improvement';
  if (trend < thresholds.stable) return '⚪ Stable';
  if (trend < thresholds.slightDecline) return '🟡 Slight Decline';
  if (trend < thresholds.declining) return '🟠 Declining';
  if (trend < thresholds.strongDecline) return '🔴 Strong Decline';
  return '🔴 Strong Decline';
}

export function formatStintAnalysis(stint: StintPerformance): string {
  // Convert seconds to MM:SS.sss format
  const avgTime = formatLapTime(stint.avgTime);
  const bestTime = formatLapTime(stint.bestLap);
  const consistencyRating = 
    stint.consistency < 0.5 ? '🟢 High' :
    stint.consistency < 1.0 ? '🟡 Medium' :
                             '🔴 Low';
  
  return [
    `  Stint ${stint.number} | Laps ${stint.startLap}-${stint.endLap} (${stint.laps} laps)`,
    `  Avg: ${avgTime} | Best: ${bestTime} | Range: ${stint.range.toFixed(3)}s`,
    `  Trend: ${getTrendIndicator(stint.trend, 0, 0)} | Consistency: ${consistencyRating}`
  ].join('\n');
}

function formatLapTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(3);
  return `${minutes}:${remainingSeconds.padStart(6, '0')}`;
}
