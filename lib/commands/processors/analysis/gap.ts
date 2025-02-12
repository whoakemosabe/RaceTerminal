import { api } from '@/lib/api/client';
import { getFlagUrl, formatWithTeamColor } from '@/lib/utils';
import { CommandFunction } from '../index';
import { GapAnalysis } from './types';

export const gapAnalysis: CommandFunction = async (args: string[], originalCommand: string) => {
  if (!args[0] || !args[1]) {
    return '❌ Error: Please provide year and round\nUsage: /gap <year> <round>\nExample: /gap 2023 1\n\nAnalyzes race gaps including:\n• Intervals between drivers\n• Gap to leader\n• Position changes\n• Battle analysis';
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

    if (!raceData?.Results?.length) {
      return `❌ Error: No race data found for ${year} round ${round}. Please check the year and round number.`;
    }

    if (!Array.isArray(lapTimes) || lapTimes.length === 0) {
      return `❌ Error: No lap time data available for ${year} round ${round}. This could be due to:\n• Race not completed\n• Timing data unavailable\n• Data not yet processed`;
    }

    // Filter out invalid lap times
    const validLapTimes = lapTimes.filter(lap => {
      if (!lap?.time || typeof lap.time !== 'string') return false;
      const time = timeToSeconds(lap.time);
      return !isNaN(time) && time > 0 && time < 300; // Filter unreasonable times (>5 min)
    });

    if (validLapTimes.length === 0) {
      return `❌ Error: No valid lap time data found for ${year} round ${round}. Please check:\n• Race has been completed\n• Timing data is available\n• Selected year/round is correct`;
    }

    // Ensure we have enough laps for meaningful analysis
    if (validLapTimes.length < 3) {
      return `❌ Error: Not enough valid laps for analysis (minimum 3 laps required). Found ${validLapTimes.length} valid laps.`;
    }

    const header = formatHeader(raceData);
    const gapAnalysis = analyzeGaps(raceData, validLapTimes);
    
    if (!gapAnalysis || gapAnalysis.length === 0) {
      return `❌ Error: Could not analyze gaps for ${year} round ${round}. No valid data available.`;
    }

    const formattedOutput = formatGapAnalysis(gapAnalysis);

    return [header, ...formattedOutput].join('\n');
  } catch (error) {
    console.error('Error analyzing race gaps:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return `❌ Error analyzing race gaps: ${errorMessage}\n\nPlease ensure:\n• Valid year and round numbers (e.g., /gap 2023 1)\n• Race has been completed\n• Data is available for the selected race`;
  }
};

function formatHeader(raceData: any): string {
  return [
    '📊 RACE GAP ANALYSIS',
    `📅 ${raceData.date}${raceData.time ? ' ' + raceData.time : ''}`,
    `📍 ${raceData.Circuit.circuitName}, ${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`,
    '═'.repeat(60),
    ''
  ].join('\n');
}

function analyzeGaps(raceData: any, lapTimes: any[]): GapAnalysis[] {
  if (!raceData?.Results || !Array.isArray(lapTimes)) {
    return [];
  }

  const driverLaps = groupLapsByDriver(lapTimes);
  
  // Filter out retired/DNF drivers and sort by position
  const finishers = raceData.Results
    .filter(result => 
      result?.status && 
      !['R', 'D', 'W', 'E', 'F', 'N'].includes(result.status)
    )
    .sort((a: any, b: any) => parseInt(a.position) - parseInt(b.position));

  if (finishers.length === 0) {
    return [];
  }

  return finishers.map((result: any) => {
    if (!result?.Driver?.driverId) {
      return null;
    }

    const driverId = result.Driver.driverId.toUpperCase();
    const driverLapTimes = driverLaps.get(driverId) || [];
    
    if (driverLapTimes.length === 0) {
      return null;
    }

    const position = parseInt(result.position);
    const driverAhead = position > 1 ?
      finishers.find((r: any) => parseInt(r.position) === position - 1) :
      null;
    
    const gapToAhead = calculateGapToAhead(driverLapTimes, driverAhead, driverLaps);
    const avgGapToLeader = calculateGapToLeader(driverLapTimes, finishers[0], driverLaps);
    const gapConsistency = calculateGapConsistency(driverLapTimes, finishers[0], driverLaps);
    const { closestRival, minGap } = findClosestRival(driverLapTimes, result, finishers, driverLaps);

    return {
      driver: result.Driver,
      constructor: result.Constructor,
      position: result.position,
      gapToAhead,
      driverAhead: driverAhead ? {
        name: `${driverAhead.Driver.givenName} ${driverAhead.Driver.familyName}`,
        nationality: driverAhead.Driver.nationality
      } : null,
      avgGapToLeader,
      gapConsistency,
      closestRival,
      minGap
    };
  }).filter(Boolean);
}

function groupLapsByDriver(lapTimes: any[]): Map<string, any[]> {
  const driverLaps = new Map();
  lapTimes.forEach(lap => {
    if (!driverLaps.has(lap.driver)) {
      driverLaps.set(lap.driver, []);
    }
    driverLaps.get(lap.driver).push({
      lap: parseInt(lap.lap),
      time: lap.time
    });
  });
  return driverLaps;
}

function timeToSeconds(time: string): number {
  if (!time) return NaN;
  
  try {
    // Convert to string if needed
    const timeStr = String(time).trim();
    
    // Handle different time formats
    if (timeStr.includes(':')) {
      const [minutes, seconds] = timeStr.split(':');
      const mins = parseInt(minutes);
      const secs = parseFloat(seconds);
      return !isNaN(mins) && !isNaN(secs) ? mins * 60 + secs : NaN;
    } else {
      // Try parsing as seconds only
      const secs = parseFloat(timeStr);
      return !isNaN(secs) ? secs : NaN;
    }
  } catch (error) {
    console.error('Error parsing time:', error);
    return NaN;
  }
}

function calculateGapToAhead(driverLaps: any[], driverAhead: any, driverLapsMap: Map<string, any[]>): number | null {
  if (!driverAhead || !Array.isArray(driverLaps) || driverLaps.length === 0) return null;
  
  // Skip if driver ahead retired or has invalid status
  if (!driverAhead?.status || ['R', 'D', 'W', 'E', 'F', 'N'].includes(driverAhead.status)) return null;

  const aheadLaps = driverLapsMap.get(driverAhead.Driver.driverId.toUpperCase()) || [];
  
  if (aheadLaps.length === 0) return null;

  const gaps = driverLaps.map((lap, index) => {
    const aheadLap = aheadLaps[index];
    if (!aheadLap || !lap) return null;
    
    const lapTime = timeToSeconds(lap.time);
    const aheadTime = timeToSeconds(aheadLap.time);
    
    // Validate times
    if (isNaN(lapTime) || isNaN(aheadTime) || lapTime <= 0 || aheadTime <= 0) return null;
    
    return lapTime - aheadTime;
  }).filter(gap => gap !== null);

  return gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : null;
}

function calculateGapToLeader(driverLaps: any[], leader: any, driverLapsMap: Map<string, any[]>): number | null {
  if (!leader || !Array.isArray(driverLaps) || driverLaps.length === 0 || 
      !leader?.status || ['R', 'D', 'W', 'E', 'F', 'N'].includes(leader.status)) return null;

  const leaderLaps = driverLapsMap.get(leader.Driver.driverId.toUpperCase()) || [];
  
  if (leaderLaps.length === 0) return null;

  const gaps = driverLaps.map((lap, index) => {
    const leaderLap = leaderLaps[index];
    if (!leaderLap || !lap) return null;
    
    const lapTime = timeToSeconds(lap.time);
    const leaderTime = timeToSeconds(leaderLap.time);
    
    // Validate times
    if (isNaN(lapTime) || isNaN(leaderTime) || lapTime <= 0 || leaderTime <= 0) return null;
    
    return lapTime - leaderTime;
  }).filter(gap => gap !== null);

  return gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : null;
}

function calculateGapConsistency(driverLaps: any[], leader: any, driverLapsMap: Map<string, any[]>): number | null {
  if (!leader || !Array.isArray(driverLaps) || driverLaps.length === 0) return null;

  const leaderLaps = driverLapsMap.get(leader.Driver.driverId.toUpperCase()) || [];
  
  if (leaderLaps.length === 0) return null;

  const gaps = driverLaps.map((lap, index) => {
    const leaderLap = leaderLaps[index];
    if (!leaderLap || !lap) return null;
    
    const lapTime = timeToSeconds(lap.time);
    const leaderTime = timeToSeconds(leaderLap.time);
    
    // Validate times
    if (isNaN(lapTime) || isNaN(leaderTime) || lapTime <= 0 || leaderTime <= 0) return null;
    
    return lapTime - leaderTime;
  }).filter(gap => gap !== null);

  if (gaps.length === 0) return null;

  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  
  // Calculate standard deviation with better numerical stability
  const squaredDiffs = gaps.map(gap => Math.pow(gap - avgGap, 2));
  const variance = squaredDiffs.reduce((acc, diff) => acc + diff, 0) / gaps.length;
  return Math.sqrt(Math.max(0, variance)); // Ensure non-negative
}

function findClosestRival(driverLaps: any[], driver: any, allDrivers: any[], driverLapsMap: Map<string, any[]>): { closestRival: any, minGap: number } {
  if (!Array.isArray(driverLaps) || driverLaps.length === 0 || !Array.isArray(allDrivers)) {
    return { closestRival: null, minGap: Infinity };
  }

  const rivalGaps = new Map();
  
  allDrivers.forEach(rival => {
    if (!rival?.Driver?.driverId || rival.Driver.driverId === driver.Driver.driverId) return;
    
    const rivalLaps = driverLapsMap.get(rival.Driver.driverId.toUpperCase()) || [];
    
    if (rivalLaps.length === 0) return;

    const gaps = driverLaps.map((lap, index) => {
      const rivalLap = rivalLaps[index];
      if (!rivalLap || !lap) return null;
      
      const lapTime = timeToSeconds(lap.time);
      const rivalTime = timeToSeconds(rivalLap.time);
      
      if (isNaN(lapTime) || isNaN(rivalTime)) return null;
      
      return Math.abs(lapTime - rivalTime);
    }).filter(gap => gap !== null);

    if (gaps.length > 0) {
      rivalGaps.set(rival.Driver.driverId, {
        avgGap: gaps.reduce((a, b) => a + b, 0) / gaps.length,
        name: rival.Driver.givenName && rival.Driver.familyName ? 
          `${rival.Driver.givenName} ${rival.Driver.familyName}` :
          'Unknown Driver'
      });
    }
  });

  let closestRival = null;
  let minGap = Infinity;
  rivalGaps.forEach((data, rivalId) => {
    if (data.avgGap < minGap) {
      minGap = data.avgGap;
      closestRival = data;
    }
  });

  return { closestRival, minGap };
}

function formatGapAnalysis(analysis: GapAnalysis[]): string[] {
  if (!Array.isArray(analysis) || analysis.length === 0) {
    return ['❌ No gap analysis data available. This could be due to:\n• No finishers in the race\n• No valid lap time data\n• Race not completed'];
  }

  return analysis.map(driver => {
    if (!driver?.driver?.nationality || !driver?.constructor?.name) {
      return '❌ Invalid driver data';
    }

    const flagUrl = getFlagUrl(driver.driver.nationality);
    const flag = flagUrl ? `<img src="${flagUrl}" alt="${driver.driver.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : '';

    const gapToLeader = driver.avgGapToLeader !== null ?
      `+${driver.avgGapToLeader.toFixed(3)}s` :
      'N/A';
       
    const gapToAheadStr = driver.gapToAhead !== null ?
      `+${driver.gapToAhead.toFixed(3)}s${driver.driverAhead?.name ? ` to ${driver.driverAhead.name}` : ''}` :
      'N/A';

    const consistency = driver.gapConsistency !== null ?
      driver.gapConsistency.toFixed(3) :
      'N/A';

    const rivalInfo = driver.closestRival ?
      `${driver.closestRival.name} (+${driver.minGap < Infinity ? driver.minGap.toFixed(3) : 'N/A'}s)` :
      'N/A';

    const consistencyRating = driver.gapConsistency !== null
      ? driver.gapConsistency < 0.5 
        ? '<span style="color: hsl(var(--success))">💫 Outstanding</span>'
        : driver.gapConsistency < 1.0
        ? '<span style="color: hsl(var(--success))">🟢 Strong</span>'
        : driver.gapConsistency < 2.0
        ? '<span style="color: hsl(var(--warning))">🟡 Variable</span>'
        : '<span style="color: hsl(var(--error))">🔴 Poor</span>'
        : 'N/A';

    // Format the main driver line according to the requested format
    const driverLine = `P${driver.position}. ${driver.driver.givenName} ${driver.driver.familyName} | ${driver.driver.nationality} ${flag} | ${formatWithTeamColor(driver.constructor.name)}`;

    return [
      driverLine,
      `Gap to P${parseInt(driver.position) - 1}: <span style="color: hsl(var(--muted-foreground))">${gapToAheadStr}</span>`,
      `Gap to Leader: <span style="color: hsl(var(--muted-foreground))">${gapToLeader}</span>`,
      `Consistency: ${consistencyRating} <span style="color: hsl(var(--muted-foreground))">(±${consistency ? parseFloat(consistency).toFixed(3) : 'N/A'}s)</span>`,
      `Closest Battle: <span style="color: hsl(var(--muted-foreground))">${rivalInfo}</span>`,
      ''
    ].join('\n');
  });
}