import { api } from '@/lib/api/client';
import { formatTime, getFlagUrl, getTeamColor } from '@/lib/utils';
import { CommandFunction } from '../index';
import { calculateTireScore, getTrendIndicator, formatStintAnalysis } from './utils';
import { DriverPaceAnalysis, StintPerformance } from './types';

export const paceAnalysis: CommandFunction = async (args: string[], originalCommand: string) => {
  if (!args[0] || !args[1]) {
    return '❌ Error: Please provide year and round\nUsage: /pace <year> <round>\nExample: /pace 2023 1\n\nAnalyzes race pace including:\n• Average lap times\n• Consistency metrics\n• Performance trends\n• Detailed timing analysis';
  }

  const year = parseInt(args[0]);
  const round = parseInt(args[1]);

  if (isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
    return `❌ Error: Invalid year. Please use a year between 1950 and ${new Date().getFullYear()}`;
  }

  if (isNaN(round) || round < 1) {
    return '❌ Error: Invalid round number';
  }

  try {
    const [raceData, lapTimes] = await Promise.all([
      api.getRaceResults(year, round),
      api.getLapTimes(year, round)
    ]);

    if (!raceData || !raceData.Results || !lapTimes || lapTimes.length === 0) {
      return '❌ Error: No data available for this race';
    }

    const header = formatHeader(raceData);
    const paceAnalysis = analyzePace(raceData, lapTimes);
    const formattedOutput = formatPaceAnalysis(paceAnalysis);

    return [header, ...formattedOutput].join('\n');

  } catch (error) {
    console.error('Error analyzing race pace:', error);
    return '❌ Error: Could not analyze race pace. Please try again later.';
  }
};

function formatHeader(raceData: any): string {
  return [
    '📊 RACE PACE ANALYSIS',
    `📅 ${raceData.date}${raceData.time ? ' ' + raceData.time : ''}`,
    `📍 ${raceData.Circuit.circuitName}, ${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`,
    '═'.repeat(60),
    ''
  ].join('\n');
}

function analyzePace(raceData: any, lapTimes: any[]): DriverPaceAnalysis[] {
  return raceData.Results.map((result: any) => {
    const driverLaps = lapTimes.filter(lap => 
      lap.driver?.toUpperCase() === result.Driver.driverId?.toUpperCase()
    );

    if (driverLaps.length === 0) return null;

    const timesInSeconds = convertLapTimes(driverLaps);
    if (timesInSeconds.length === 0) return null;

    const stints = analyzeStints(driverLaps, timesInSeconds);
    const bestStint = stints.length > 0 ? 
      stints.reduce((best, stint) => 
        !best || stint.avgTime < best.avgTime ? stint : best
      ) : null;

    return {
      driverId: result.Driver.driverId,
      timesInSeconds,
      avgTime: calculateAverage(timesInSeconds),
      median: calculateMedian(timesInSeconds),
      bestTime: Math.min(...timesInSeconds),
      consistency: calculateConsistency(timesInSeconds),
      iqr: calculateIQR(timesInSeconds),
      stints,
      bestStint,
      result
    };
  }).filter(Boolean);
}

function convertLapTimes(laps: any[]): number[] {
  return laps.map(lap => {
    const [minutes, seconds] = lap.time.split(':');
    return parseFloat(minutes) * 60 + parseFloat(seconds);
  }).filter(time => !isNaN(time) && time > 0 && time <= 120);
}

function analyzeStints(laps: any[], times: number[]): StintPerformance[] {
  const stints: StintPerformance[] = [];
  let currentStint: number[] = [];
  let lastLapNumber: number | null = null;
  let lastLapTime: number | null = null;

  laps.forEach((lap, idx) => {
    const time = times[idx];
    if (!time || isNaN(time) || time <= 0 || time > 120) return;
    
    const lapNumber = parseInt(lap.lap);
    if (lastLapNumber === null) {
      lastLapNumber = lapNumber;
      lastLapTime = time;
      currentStint.push(time);
      return;
    }

    const isNewStint = 
      (lapNumber - lastLapNumber > 3) ||
      (Math.abs(time - lastLapTime!) > 3.5);

    if (isNewStint && currentStint.length >= 3) {
      stints.push(createStintPerformance(currentStint, stints.length + 1, lastLapNumber!, lapNumber));
      currentStint = [];
    }

    currentStint.push(time);
    lastLapNumber = lapNumber;
    lastLapTime = time;
  });

  if (currentStint.length >= 3) {
    stints.push(createStintPerformance(currentStint, stints.length + 1, lastLapNumber!, lastLapNumber! + currentStint.length));
  }

  return stints;
}

function createStintPerformance(times: number[], number: number, startLap: number, endLap: number): StintPerformance {
  const avgTime = calculateAverage(times);
  return {
    number,
    laps: times.length,
    startLap,
    endLap,
    avgTime,
    medianTime: calculateMedian(times),
    bestLap: Math.min(...times),
    worstLap: Math.max(...times),
    range: Math.max(...times) - Math.min(...times),
    trend: calculateTrend(times),
    consistency: calculateConsistency(times)
  };
}

function calculateAverage(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function calculateMedian(numbers: number[]): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function calculateConsistency(numbers: number[]): number {
  const avg = calculateAverage(numbers);
  return Math.sqrt(numbers.reduce((acc, n) => acc + Math.pow(n - avg, 2), 0) / numbers.length);
}

function calculateIQR(numbers: number[]): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  return q3 - q1;
}

function calculateTrend(numbers: number[]): number {
  const firstHalf = numbers.slice(0, Math.floor(numbers.length / 2));
  const secondHalf = numbers.slice(Math.floor(numbers.length / 2));
  return calculateAverage(secondHalf) - calculateAverage(firstHalf);
}

function formatPaceAnalysis(analysis: DriverPaceAnalysis[]): string[] {
  analysis.sort((a, b) => a.avgTime - b.avgTime);
  
  return analysis.map((driver, index) => {
    const driverResult = driver.result;
    const startPos = parseInt(driverResult.grid) || 20;
    const finishPos = index + 1;
    
    const tireScore = calculateTireScore(
      driver.timesInSeconds,
      startPos,
      finishPos,
      driver.stints,
      calculateTrend(driver.timesInSeconds),
      index
    );

    const tireRating = 
      tireScore >= 9.2 ? '<span style="color: hsl(var(--success))">💫 Outstanding</span>' :
      tireScore >= 8.2 ? '<span style="color: hsl(var(--success))">🟢 Excellent</span>' :
      tireScore >= 7.0 ? '<span style="color: hsl(var(--success))">🟢 Good</span>' :
      tireScore >= 5.8 ? '<span style="color: hsl(var(--warning))">🟡 Fair</span>' :
      tireScore >= 4.5 ? '<span style="color: hsl(var(--info))">🟠 Moderate</span>' :
      '<span style="color: hsl(var(--error))">🔴 Poor</span>';

    const relativePerf = ((driver.avgTime / analysis[0].avgTime) - 1) * 100;
    const perfRating = 
      relativePerf <= 0.3 ? '<span style="color: hsl(var(--success))">💫 Outstanding</span>' :
      relativePerf <= 0.6 ? '<span style="color: hsl(var(--success))">🟢 Strong</span>' :
      relativePerf <= 1.0 ? '<span style="color: hsl(var(--success))">🟢 Competitive</span>' :
      relativePerf <= 1.5 ? '<span style="color: hsl(var(--warning))">🟡 Midfield</span>' :
      relativePerf <= 2.0 ? '<span style="color: hsl(var(--info))">🟠 Developing</span>' :
      '<span style="color: hsl(var(--error))">🔴 Poor</span>';

    const trend = calculateTrend(driver.timesInSeconds);
    const trendIndicator = getTrendIndicator(trend, finishPos, startPos);

    return formatDriverOutput(
      driver,
      index + 1,
      perfRating,
      relativePerf,
      tireRating,
      trendIndicator
    );
  });
}

function formatDriverOutput(
  driver: DriverPaceAnalysis,
  position: number,
  perfRating: string,
  relativePerf: number,
  tireRating: string,
  trendIndicator: string
): string {
  const driverResult = driver.result;
  const flagUrl = getFlagUrl(driverResult.Driver.nationality);
  const flag = flagUrl ? `<img src="${flagUrl}" alt="${driverResult.Driver.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : '';
  const teamColor = getTeamColor(driverResult.Constructor.name);

  // Calculate position changes
  const startPos = parseInt(driverResult.grid) || 0;
  const finishPos = parseInt(driverResult.position);
  const positionChange = startPos === 0 ? 'PIT' : startPos - finishPos;
  const positionIndicator = positionChange === 'PIT' ? '<span style="color: hsl(var(--secondary))">🔧 Pit Lane Start</span>' :
                           positionChange > 0 ? `<span style="color: hsl(142.1 76.2% 36.3%)">↗️ Gained ${positionChange}</span>` :
                           positionChange < 0 ? `<span style="color: hsl(0 72.2% 50.6%)">↘️ Lost ${Math.abs(positionChange)}</span>` :
                           '<span style="color: hsl(var(--muted-foreground))">➡️ No Change</span>';
  const positionText = `Grid: P${startPos === 0 ? 'IT' : startPos} → P${finishPos} | ${positionIndicator}`;

  // Format the main driver line according to the requested format
  const driverLine = `P${driverResult.position}. ${driverResult.Driver.givenName} ${driverResult.Driver.familyName} | ${driverResult.Driver.nationality} ${flag} | <span style="color: ${teamColor}">${driverResult.Constructor.name}</span>`;

  const lapTimeStats = [
    `Average: <span style="color: hsl(var(--muted-foreground))">${formatLapTime(driver.avgTime)}</span>`,
    `Median: <span style="color: hsl(var(--muted-foreground))">${formatLapTime(driver.median)}</span>`,
    `Best: <span style="color: hsl(var(--muted-foreground))">${formatLapTime(driver.bestTime)}</span>`
  ].join(' │ ');

  const perfMetrics = [
    `Race Pace: ${perfRating} <span style="color: hsl(var(--muted-foreground))">(${relativePerf.toFixed(3)}% off lead)</span>`,
    `Tire Management: ${tireRating}`,
    `Pace Trend: ${trendIndicator}`
  ].join(' │ ');

  const stintAnalysis = driver.stints.map(formatStintAnalysis).join('\n\n');

  return [
    driverLine,
    positionText,
    `Lap Times | ${lapTimeStats}`,
    `Performance | ${perfMetrics}`,
    '',
    'Stint Analysis:',
    stintAnalysis,
    '',
    `Best Stint: <span style="color: hsl(var(--muted-foreground))">${driver.bestStint ? `#${driver.bestStint.number} (Laps ${driver.bestStint.startLap}-${driver.bestStint.endLap}, ${driver.bestStint.laps} laps)` : 'N/A'}</span>`,
    ''
  ].join('\n');
}

function formatLapTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(3);
  return `${minutes}:${remainingSeconds.padStart(6, '0')}`;
}