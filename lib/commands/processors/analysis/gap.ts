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
  const finishers = raceData.Results.map(result => ({
    ...result,
    // Add lap count to each result
    completedLaps: result.laps || driverLaps.get(result.Driver.driverId.toUpperCase())?.length || 0
  }))
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
    const { closestRival, minGap, battleLaps } = findClosestRival(driverLapTimes, result, finishers, driverLaps);
    const bestLap = Math.min(...driverLapTimes.map(lap => timeToSeconds(lap.time)));
    const initialGapToLeader = calculateInitialGapToLeader(driverLapTimes, finishers[0], driverLaps);

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
      minGap,
      battleLaps,
      bestLap,
      initialGapToLeader,
      gapToLeader: avgGapToLeader
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

function calculateGapToAhead(driverLaps: any[], driverAhead: any, driverLapsMap: Map<string, any[]>): { seconds: number, percentage: number } | null {
  if (!driverAhead || !Array.isArray(driverLaps) || driverLaps.length === 0) return null;
  
  // Skip if driver ahead retired or has invalid status
  if (!driverAhead?.status || ['R', 'D', 'W', 'E', 'F', 'N'].includes(driverAhead.status)) return null;

  const aheadLaps = driverLapsMap.get(driverAhead.Driver.driverId.toUpperCase()) || [];
  
  if (aheadLaps.length === 0) return null;

  const gaps = driverLaps.map((lap, index) => {
    const aheadLap = aheadLaps[index];
    if (!aheadLap || !lap) return null;

    // Handle pit stops more gracefully
    if (lap.time.includes('PIT') || aheadLap.time.includes('PIT')) {
      // Skip this lap but don't invalidate the entire stint
      return null;
    }
    
    const lapTime = timeToSeconds(lap.time);
    const aheadTime = timeToSeconds(aheadLap.time);
    
    // Basic time validation
    if (isNaN(lapTime) || isNaN(aheadTime)) return null;
    if (lapTime <= 0 || aheadTime <= 0) return null;
    
    // Skip anomalous gaps (likely due to incidents, blue flags, etc)
    const gap = lapTime - aheadTime;
    // More permissive gap filtering
    if (Math.abs(gap) > 60.0) return null; // Only skip extremely large gaps
    
    // Return both absolute gap and percentage
    return {
      seconds: gap,
      percentage: (gap / aheadTime) * 100
    };
  }).filter(gap => gap !== null);

  if (gaps.length === 0) return null;
  
  // Calculate averages for both metrics
  return {
    seconds: gaps.reduce((a, b) => a + b.seconds, 0) / gaps.length,
    percentage: gaps.reduce((a, b) => a + b.percentage, 0) / gaps.length
  };
}

function calculateGapToLeader(driverLaps: any[], leader: any, driverLapsMap: Map<string, any[]>): { seconds: number, percentage: number } | null {
  if (!leader || !Array.isArray(driverLaps) || driverLaps.length === 0 || 
      !leader?.status || ['R', 'D', 'W', 'E', 'F', 'N'].includes(leader.status)) return null;

  const leaderLaps = driverLapsMap.get(leader.Driver.driverId.toUpperCase()) || [];
  
  if (leaderLaps.length === 0) return null;

  const gaps = driverLaps.map((lap, index) => {
    const leaderLap = leaderLaps[index];
    if (!leaderLap || !lap) return null;

    // Handle pit stops more gracefully
    if (lap.time.includes('PIT') || leaderLap.time.includes('PIT')) {
      // Skip this lap but don't invalidate the entire stint
      return null;
    }
    
    const leaderTime = timeToSeconds(leaderLap.time);
    const lapTime = timeToSeconds(lap.time);
    
    // Basic time validation
    if (isNaN(lapTime) || isNaN(leaderTime)) return null;
    if (lapTime <= 0 || leaderTime <= 0) return null;
    
    // Skip anomalous gaps (likely due to incidents, blue flags, etc)
    const gap = lapTime - leaderTime;
    // More permissive gap filtering for lapped cars
    if (Math.abs(gap) > 120.0) return null; // Only skip gaps over 2 minutes
    
    // Return both absolute gap and percentage
    return {
      seconds: gap,
      percentage: (gap / leaderTime) * 100
    };
  }).filter(gap => gap !== null);

  if (gaps.length === 0) return null;
  
  // Calculate averages for both metrics
  return {
    seconds: gaps.reduce((a, b) => a + b.seconds, 0) / gaps.length,
    percentage: Math.abs(gaps.reduce((a, b) => a + b.percentage, 0) / gaps.length) // Ensure percentage is positive
  };
}

function calculateInitialGapToLeader(driverLaps: any[], leader: any, driverLapsMap: Map<string, any[]>): { seconds: number, percentage: number } | null {
  if (!leader || !Array.isArray(driverLaps) || driverLaps.length === 0 || 
      !leader?.status || ['R', 'D', 'W', 'E', 'F', 'N'].includes(leader.status)) return null;

  const leaderLaps = driverLapsMap.get(leader.Driver.driverId.toUpperCase()) || [];
  
  if (leaderLaps.length === 0) return null;

  const firstLap = driverLaps[0];
  const firstLeaderLap = leaderLaps[0];

  if (!firstLap || !firstLeaderLap) return null;

  const firstLeaderTime = timeToSeconds(firstLeaderLap.time);
  const lapTime = timeToSeconds(firstLap.time);

  if (isNaN(lapTime) || isNaN(firstLeaderTime) || firstLeaderTime <= 0) return null;

  // Calculate initial gap as percentage of leader's lap time
  return {
    seconds: lapTime - firstLeaderTime,
    percentage: ((lapTime - firstLeaderTime) / firstLeaderTime) * 100
  };
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
    if (isNaN(lapTime) || isNaN(leaderTime) || leaderTime <= 0) return null;
    
    // Calculate gap as percentage of leader's lap time
    return ((lapTime - leaderTime) / leaderTime) * 100;
  }).filter(gap => gap !== null);

  if (gaps.length === 0) return null;

  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  
  // Calculate standard deviation with better numerical stability
  const squaredDiffs = gaps.map(gap => Math.pow(gap - avgGap, 2));
  const variance = squaredDiffs.reduce((acc, diff) => acc + diff, 0) / gaps.length;
  return Math.sqrt(Math.max(0, variance)); // Ensure non-negative
}

function findClosestRival(driverLaps: any[], driver: any, allDrivers: any[], driverLapsMap: Map<string, any[]>): { closestRival: any, minGap: number, battleLaps: number } {
  if (!Array.isArray(driverLaps) || driverLaps.length === 0 || !Array.isArray(allDrivers)) {
    return { closestRival: null, minGap: Infinity, battleLaps: 0 };
  }

  const rivalGaps = new Map();
  let battleLaps = 0;
  
  allDrivers.forEach(rival => {
    if (!rival?.Driver?.driverId || rival.Driver.driverId === driver.Driver.driverId) return;
    
    const rivalLaps = driverLapsMap.get(rival.Driver.driverId.toUpperCase()) || [];
    
    if (rivalLaps.length === 0) return;

    const gaps = driverLaps.map((lap, index) => {
      const rivalLap = rivalLaps[index];
      if (!rivalLap || !lap) return null;

      // Handle pit stops more gracefully
      if (lap.time.includes('PIT') || rivalLap.time.includes('PIT')) {
        // Skip this lap but don't invalidate the entire stint
        return null;
      }
      
      const lapTime = timeToSeconds(lap.time);
      const rivalTime = timeToSeconds(rivalLap.time);
      
      // Validate times more permissively
      if (isNaN(lapTime) || isNaN(rivalTime) || rivalTime <= 0 || lapTime <= 0) return null;
      
      // Calculate absolute gap in seconds
      const gap = Math.abs(lapTime - rivalTime);
      
      // Allow larger gaps for battles
      if (gap > 20.0) return null; // Skip only very large gaps
      
      // Count laps within battle range (2.0 seconds)
      if (gap < 2.0) {
        battleLaps++;
      }
      
      return gap;
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

  return { closestRival, minGap, battleLaps };
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

    // Format gap to leader (always positive since they're behind)
    const gapToLeaderStr = driver.position === "1" ? 
      'LEADER' :
      driver.avgGapToLeader?.seconds !== undefined ?
        `+${Math.abs(driver.avgGapToLeader.seconds).toFixed(3)}s (+${Math.abs(driver.avgGapToLeader.percentage).toFixed(2)}%)` :
        'N/A';
       
    // Format gap to car ahead (if any)
    const gapToAheadStr = driver.position === "1" ? 
      'N/A' :
      driver.gapToAhead?.seconds !== undefined ?
        `+${Math.abs(driver.gapToAhead.seconds).toFixed(3)}s (+${Math.abs(driver.gapToAhead.percentage).toFixed(2)}%)${driver.driverAhead?.name ? ` to ${driver.driverAhead.name}` : ''}` :
        'N/A';

    const consistency = driver.gapConsistency !== null ?
      driver.gapConsistency.toFixed(3) :
      'N/A';

    // Calculate gap trend
    const gapTrend = driver.avgGapToLeader?.percentage !== undefined && driver.initialGapToLeader?.percentage !== undefined ?
      driver.avgGapToLeader.percentage - driver.initialGapToLeader.percentage :
      null;

    const trendIndicator = gapTrend !== null ?
      driver.position === "1" ? '<span style="color: hsl(var(--success))">🟣 Leading</span>' :
      gapTrend < -0.5 ? '<span style="color: hsl(var(--success))">🟢 Catching</span>' :
      gapTrend < 0 ? '<span style="color: hsl(var(--success))">🟢 Maintaining</span>' :
      gapTrend < 0.5 ? '<span style="color: hsl(var(--warning))">🟡 Dropping</span>' :
      '<span style="color: hsl(var(--error))">🔴 Struggling</span>' :
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

    const rivalInfo = driver.closestRival ?
      `${driver.closestRival.name} (+${driver.minGap < Infinity ? driver.minGap.toFixed(3) : 'N/A'}s/${driver.battleLaps}L)` :
      'N/A';

    // Calculate battle intensity
    const battleIntensity = driver.battleLaps > 20 ? '<span style="color: hsl(var(--success))">🔥 Intense</span>' :
                          driver.battleLaps > 10 ? '<span style="color: hsl(var(--warning))">⚡ Active</span>' :
                          driver.battleLaps > 5 ? '<span style="color: hsl(var(--info))">🌟 Moderate</span>' :
                          '<span style="color: hsl(var(--muted-foreground))">⚪ Limited</span>';

    // Format the main driver line according to the requested format
    const driverLine = `P${driver.position}. ${driver.driver.givenName} ${driver.driver.familyName} | ${driver.driver.nationality} ${flag} | ${formatWithTeamColor(driver.constructor.name)}`;

    // Format gaps line with proper indicators
    const gapsLine = driver.position === "1" ?
      `Gaps: ${trendIndicator} | <span style="color: hsl(var(--muted-foreground))">Race Leader</span>` :
      `Gaps: ${trendIndicator} | <span style="color: hsl(var(--muted-foreground))">Leader: ${gapToLeaderStr} | Behind: ${gapToAheadStr}</span>`;
    return [
      driverLine,
      gapsLine,
      `Pace: ${consistencyRating} | <span style="color: hsl(var(--muted-foreground))">Best: ${driver.bestLap.toFixed(3)}s (±${consistency ? parseFloat(consistency).toFixed(3) : 'N/A'}s)</span>`,
      `Battle: ${battleIntensity} | <span style="color: hsl(var(--muted-foreground))">vs ${rivalInfo}</span>`,
      ''
    ].join('\n');
  });
}